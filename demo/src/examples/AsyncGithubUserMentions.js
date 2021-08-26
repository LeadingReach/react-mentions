import React, { useState } from 'react'

import { MentionsInput, Mention } from '../../../src'

import { provideExampleValue } from './higher-order'

import defaultStyle from './defaultStyle'
import defaultMentionStyle from './defaultMentionStyle'

function getDefaultSuggestions() {
  return [
    { display: '@all', id: 'all' },
    // These two are not actual suggestios we should select
    // they are just what will trigger the API calls to get
    // mentions for "myOrg" or "otherOrg"
    { display: 'My Orgs', id: 'myOrg' },
    { display: 'Other Orgs', id: 'otherOrg' },
  ]
}

function renderSuggestion(entry, search, highlightedDisplay, index, focused) {
  return (
    <div>
      {entry.avatar_url && (
        <span>
          <img src={entry.avatar_url} alt={entry.display} height="20px" />
          &nbsp;
        </span>
      )}
      <strong>{entry.display}</strong>
    </div>
  )
}

function renderSelectedMention(id, display) {
  return `@${id}`
}

function handleBeforeAdd(id, display) {
  let skipAdd = false
  const skipList = ['myOrg', 'otherOrg']

  // TODO: If it's one of the options to get a list of availabe org suggestions
  // Skip the add and trigger the API call to get that list
  if (skipList.includes(id)) {
    skipAdd = true
  }

  return skipAdd
}

function AsyncGithubUserMentions({ value, data, onChange }) {
  const [isLoading, setIsLoading] = useState(false)

  const fetchUsers = (query, callback) => {
    // Get default mention suggestions
    if (!query) {
      return getDefaultSuggestions()
    }

    setIsLoading(true)
    fetch(`https://api.github.com/search/users?q=${query}`, { json: true })
      .then((res) => res.json())
      // Transform the users to what react-mentions expects
      .then((res) => {
        const options = res.items.map((user) => ({
          display: user.login,
          id: user.login,
          avatar_url: user.avatar_url,
        }))
        const defaultOptions = getDefaultSuggestions().map((item) => item)
        setIsLoading(false)

        return [...options, ...defaultOptions]
      })
      .then(callback)
  }

  const renderMention = (id, display) => {
    return <strong className="test-class">{display}</strong>
  }

  const renderLoader = () => {
    return <span>...Loading...</span>
  }

  return (
    <div className="async">
      <h3>Async Github user mentions</h3>

      <MentionsInput
        value={value}
        onChange={onChange}
        style={defaultStyle}
        placeholder="Send a note to provider. You can mention other users or teams by typing `@` and their name, team, or title"
        a11ySuggestionsListLabel={'Suggested mentions'}
        loader={renderLoader}
      >
        <Mention
          displayTransform={renderSelectedMention}
          trigger="@"
          data={fetchUsers}
          style={defaultMentionStyle}
          render={renderMention}
          renderSuggestion={renderSuggestion}
          beforeAdd={handleBeforeAdd}
          isLoading={isLoading}
        />
      </MentionsInput>
    </div>
  )
}

const asExample = provideExampleValue('')

export default asExample(AsyncGithubUserMentions)

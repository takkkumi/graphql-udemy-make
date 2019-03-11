import gql from 'graphql-tag'


export const searchRepositories = gql`
query searchRepositories($after: String, $before: String, $first: Int, $last: Int, $query: String!) {
  search(first: $first, last: $last, before: $before, after: $after, query: $query, type: REPOSITORY) {
    repositoryCount
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
    edges {
      cursor
      node {
        ... on Repository {
          id
          name
          url
          stargazers{
            totalCount
          }
          viewerHasStarred
        }
      }
    }
  }
}`

export const ME = gql`
query me {
    user(login: "iteachonudemy") {
      name
      avatarUrl
    }
  }
`
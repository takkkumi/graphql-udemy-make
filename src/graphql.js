import gql from 'graphql-tag'

export const searchRepositories = gql`
  query searchRepositories($first: Int, $after: String, $last: Int, $before: String, $query: String!) {
    search(first: $first, after: $after, last: $last, before: $before, query: $query, type: REPOSITORY) {
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
            stargazers {
              totalCount
            }
            viewerHasStarred
          }
        }
      }
    }
  }
`
export const AddStars = gql`
mutation addStar($input: AddStarInput!){
  addStar(input: $input){
    starrable{
      id
      viewerHasStarred
    }
  }
}`

export const RemoveStars = gql`
mutation removeStar($input: RemoveStarInput!){
  removeStar(input: $input){
    starrable{
      id
      viewerHasStarred
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

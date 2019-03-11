import React, { Component } from 'react';
import {ApolloProvider} from 'react-apollo'
import {searchRepositories} from './graphql' 
import {Query} from 'react-apollo'
import client from './client'

const VARIABLES = {
   "first": 5,
  "last": null,
  "before": null,
  "after": null,
  "query": "フロントエンドエンジニア"
}

class App extends Component {
  constructor(props){
    super(props)
    this.state = VARIABLES
  }
  render() {
    const {query,first,last,before,after} = this.state
    return (
      <ApolloProvider client={client}>
      <Query
      query={searchRepositories}
      variables= {{query,first,last,before,after}}>
        
        {
          ({loading, error, data}) =>{
            if (loading) return 'Loading...'
            if (error) return `Error! ${error.message}`
            console.log(data)
            return <div></div>
          }
        }
     </Query >
        
      
      </ApolloProvider >
    )
  }
}

export default App;
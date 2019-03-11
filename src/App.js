import React, { Component } from 'react';
import {ApolloProvider} from 'react-apollo'
import {ME} from './graphql' 
import {Query} from 'react-apollo'
import client from './client'



class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
      <div>
        Hello graphQL
        </div>
        <Query query={ME}>
        {
          ({loading, error, data}) =>{
            if (loading) return 'Loading...'
            if (error) return `Error! ${error.message}`
            return <div>{data.user.name}</div>
          }
        }
     </Query >
        
      
      </ApolloProvider >
    )
  }
}

export default App;
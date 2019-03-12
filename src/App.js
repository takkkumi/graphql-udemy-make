import React, { Component } from 'react';
import {ApolloProvider} from 'react-apollo'
import {searchRepositories} from './graphql' 
import {Query} from 'react-apollo'
import client from './client'

const DEFAULT_STATE = {
   "first": 5,
  "last": null,
  "before": null,
  "after": null,
  "query": "フロントエンドエンジニア"
}

class App extends Component {
  constructor(props){
    super(props)
    this.state = DEFAULT_STATE
    this.handleChange=this.handleChange.bind(this)
    this.handleSubmit=this.handleSubmit.bind(this)
  }
  handleChange(event){
    this.setState({
      ...DEFAULT_STATE,
      query: event.target.value
    })
  }
  handleSubmit(event){
    event.preventDefault()
  }
  render() {
    const {query,first,last,before,after} = this.state
    console.log({query})
    
    return (
      <ApolloProvider client={client}>
      <form onSubmit={this.handleSubmit}>
      <input value={query} onChange={this.handleChange}/> 
      </form>
      <Query
      query={searchRepositories}
      variables= {{query,first,last,before,after}}>
        
        {
          ({loading, error, data}) =>{
            if (loading) return 'Loading...'
            if (error) return `Error! ${error.message}`
            console.log(data.search)
            const search = data.search
            const repositoryCount = search.repositoryCount
            const repositoryUnit = repositoryCount === 1?  "Repository" : "Repositories"
            const title = `Github Repositories Search Results -${data.search.repositoryCount} ${repositoryUnit}`
            return (
              <React.Fragment>
              <h2>{title}</h2>)
              <ul>
              {
                
                search.edges.map(edge => {
                  const node = edge.node
                  return(
                    <li key={node.id} >
                    <a href={node.url} target="_blank">{node.name}</a>
                    </li>
                    )
                })
              }
              </ul>
              </React.Fragment>)
          }
        }
     </Query >
        
      
      </ApolloProvider >
    )
  }
}

export default App;
import React, { Component } from 'react';
import {AddStars , RemoveStars,searchRepositories} from './graphql' 
import {Mutation,ApolloProvider,Query} from 'react-apollo'
import client from './client'

const StarButton = props =>{
  const {node,query,first,last,before,after} = props
  const totalCount = node.stargazers.totalCount
  const viewerHasStarred = node.viewerHasStarred
  const stargazerUnit = totalCount === 1 ? "star":"stars"
  const StarStatus = ({AddOrRemoveStar}) => {
  return (
    <button
    onClick={
    () =>  AddOrRemoveStar({
      variables: {input: {starrableId: node.id}},
      update: (store,{ data: {addStar,removeStar}}) =>{
      const {starrable} = addStar || removeStar
      const requestAddCheck = {starrable} === addStar && viewerHasStarred
      const requestRemoveCheck = {starrable} === removeStar && !viewerHasStarred
      const requestCheck = requestAddCheck || requestAddCheck
      const data = store.readQuery({
        query: searchRepositories,
      variables: {query,first,last,before,after}})
       const edges = data.search.edges
       const newEdges = edges.map(edge => {
         if (edge.node.id === node.id) {
           const totalCount = edge.node.stargazers.totalCount
           const diff = starrable.viewerHasStarred? 1: -1
           const newTotalCount = totalCount+ diff
           edge.node.stargazers.totalCount = newTotalCount
         }
         return edge
       })
        data.search.edges = newEdges
        store.writeQuery({ query: searchRepositories,data})
      }
     
    })
    }
    >
    {`${totalCount} ${stargazerUnit}`}| {viewerHasStarred ? "starred" : "-"}
    </button>
    )
  }
  return (
    <Mutation mutation={viewerHasStarred? RemoveStars : AddStars}
    
     >
    {
      AddOrRemoveStar => <StarStatus AddOrRemoveStar={AddOrRemoveStar} />
    }
    </Mutation>
  )
}
const PER_PAGE = 5
const DEFAULT_STATE = {
   "first": PER_PAGE,
  "last": null,
  "before": null,
  "after": null,
  "query": ""
}

class App extends Component {
  constructor(props){
    super(props)
    this.state = DEFAULT_STATE
    this.myRef = React.createRef()
    this.handleSubmit=this.handleSubmit.bind(this)
  }
 
  handleSubmit(event){
    event.preventDefault()
    
    this.setState({
      query: this.myRef.current.value
    })
  }
  goNext(search){
    this.setState({
      first: PER_PAGE,
      after: search.pageInfo.endCursor,
      last: null,
      before: null
    })
  }
  goPrevious(search){
    this.setState({
      first: null,
      after: null,
      last: PER_PAGE,
      before: search.pageInfo.startCursor
    })
  }
  render() {
    const {query,first,last,before,after} = this.state
   
    
    return (
      <ApolloProvider client={client}>
      <form onSubmit={this.handleSubmit}>
      <input ref = {this.myRef} /> 
      <input type = "submit" value = "Submit" />
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
             const nextpage = search.pageInfo.hasNextPage 
             const previouspage = search.pageInfo.hasPreviousPage
             
            return (
              <React.Fragment>
              <h2>{title}</h2>
              <ul>
              
              {
                
                search.edges.map(edge => {
                  const node = edge.node
                  return(
                    <li key={node.id} >
                    <a href={node.url} target="_blank" rel="noopener noreferrer">{node.name}</a>
                    &nbsp;
                    <StarButton node={node} {...{query,first,last,before,after}}/>
                    </li>
                    )
                })
              }
              </ul>
             { previouspage === true ?
             <button
             onClick={this.goPrevious.bind(this,search)}
             >
             Previous
             </button>
               : null
             }
            
             
             { nextpage === true ?
            <button
            onClick={this.goNext.bind(this,search)}
            >
               Next
              </button>
              : null }
              </React.Fragment>)
          }
        }
     </Query >
        
      
      </ApolloProvider >
    )
  }
}

export default App;
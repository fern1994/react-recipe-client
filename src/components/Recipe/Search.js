import React, { Component } from 'react'
import { ApolloConsumer } from 'react-apollo'
import { SEARCH_RECIPE } from '../../queries'
import SearchItem from './SearchItem'

class Search extends Component {
  state = {
    searchResult: []
  }

  handleChangeData = ({searchRecipes}) => {
    this.setState({
      searchResult: searchRecipes
    })
  }

  render() {
    const { searchResult } = this.state
    return (
      <ApolloConsumer>
        {
          client => {
            return (
              <div className='App'>
                <input
                  type='search'
                  placeholder='Search for Recipes'
                  onChange={async (event) => {
                    event.persist()
                    const { data } = await client.query({
                      query: SEARCH_RECIPE,
                      variables: { searchTerm: event.target.value }
                    })
                    this.handleChangeData(data)
                  }
                  } />
                <ul>
                  {
                    searchResult.map(recipe => (
                      <SearchItem key={recipe._id} _id={recipe._id} name={recipe.name} likes={recipe.likes}/>
                    ))
                  }
                </ul>
              </div>
            )
          }
        }
      </ApolloConsumer>
    )
  }
}
export default Search
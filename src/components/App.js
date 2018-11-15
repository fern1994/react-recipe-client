import React from 'react'
import { Query } from 'react-apollo'

import './App.css'
import { GET_ALL_RECIPES } from '../queries'
import RecipeItem from '../components/Recipe/RecipeItem'

const App = () => (
  <div className="App">
    <h1>Home</h1>
    <Query query={GET_ALL_RECIPES}>
      {
        ({ data, loading, error }) => {
          loading && <div>Loading</div>
          error && <div>Error</div>
          return (
            <ul>
              {
                data.getAllRecipes && data.getAllRecipes.map(recipe => (
                  <RecipeItem  key={recipe._id} _id={recipe._id} name={recipe.name} category={recipe.category}/>
                ))
              }
            </ul>
          )
        }
      }
    </Query>
  </div>

)

export default App;

import React, { Component } from 'react'
import { Mutation } from 'react-apollo';
import { ADD_RECIPE, GET_ALL_RECIPES } from '../../queries'
import { withRouter } from 'react-router-dom'
import withAuth from '../withAuth'

const initailState = {
  name: '',
  category: 'Breakfast',
  description: '',
  instructions: '',
  username: ''
}

class AddRecipe extends Component {
  state = { ...initailState }

  clearState = () => {
    this.setState({ ...initailState })
  }

  componentDidMount() {
    this.setState({
      username: this.props.session.getCurrentUser.username
    })
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  validateForm = () => {
    const { name, category, description, instructions } = this.state
    const isInvalid = !name || !category || !description || !instructions || !instructions
    return isInvalid
  }

  handleSubmit = (event, addRecipe) => {
    event.preventDefault()
    addRecipe().then(({ data }) => {
      this.clearState()
      this.props.history.push('/')
    })
  }

  updateCache = (cache, { data: { addRecipe } }) => {
    /** ตอนใส่ function นี้ใน prop update จะได้ cache และ data
     * cache ฟังก์ชันที่ใช้เขียนและอ่านข้อมูลลง cache
     * data มีข้อมูลที่เพิ่งเพิ่มเข้าไป
     */
    const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES })


    cache.writeQuery({
      query: GET_ALL_RECIPES,
      data: {
        getAllRecipes: getAllRecipes.concat([addRecipe])
      }
    })
  }

  render() {
    const { name, category, description, instructions, username } = this.state

    return (
      <Mutation
        mutation={ADD_RECIPE}
        variables={{ name, category, description, instructions, username }}
        refetchQueries={() => [
          { query: GET_ALL_RECIPES, variables: {username} },
        ]}
        update={this.updateCache}>
        {
          (addRecipe, { data, loading, error }) => {
            return (
              <div className='App' onSubmit={(event) => this.handleSubmit(event, addRecipe)}>
                <h2 className='App'>Add Recipe</h2>
                <form className='form'>
                  <input type='text' name='name' placeholder='Recipe Name' onChange={this.handleChange} value={name} />
                  <select name='category' onChange={this.handleChange} value={category}>
                    <option value='Breakfast'>Breakfast</option>
                    <option value='Lunch'>Lunch</option>
                    <option value='Dinner'>Dinner</option>
                    <option value='Snack'>Snack</option>
                  </select>
                  <input type='text' name='description' placeholder='Add description' onChange={this.handleChange} value={description} />
                  <textarea name='instructions' placeholder='Add instructions' onChange={this.handleChange} value={instructions} />
                  <button disabled={loading || this.validateForm()} type='submit' className='button-primary'>Submit</button>
                </form>
              </div>
            )
          }
        }
      </Mutation>
    )
  }
}

export default withAuth(session => session && session.getCurrentUser)(withRouter(AddRecipe))
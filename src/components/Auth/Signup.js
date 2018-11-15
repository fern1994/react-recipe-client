import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'

import { SIGNUP_USER } from '../../queries'
import Error from './Error'

const initailState = {
  username: '',
  email: '',
  password: '',
  passwordConfirmation: ''
}

class Signup extends Component {
  state = {...initailState}

  clearState = () => {
    this.setState({...initailState})
  }

  handleChange = event => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  handleSubmit = (event, signupUser) => {
    event.preventDefault()
    signupUser().then(async ({data}) => {
      await this.props.refetch()
      this.clearState()
      this.props.history.push('/')
    })
  }

  validateForm = () => {
    const { username, email, password, passwordConfirmation } = this.state
    const isInvalid = !username || !email || !password || password !== passwordConfirmation
    return isInvalid 
  }

  render() {
    const { username, email, password, passwordConfirmation } = this.state
    return (
      <div className='App'>
        <h2 className='App'>Signup</h2>
        <Mutation mutation={SIGNUP_USER} variables={{ username, email, password }}>
          {(signupUser, { data, loading, error }) => {
            return (
              <form className='form' onSubmit={event => this.handleSubmit(event, signupUser)}>
                <input type='text' name='username' placeholder='Username' onChange={this.handleChange} value={username} />
                <input type='email' name='email' placeholder='Email' onChange={this.handleChange} value={email} />
                <input type='password' name='password' placeholder='Password' onChange={this.handleChange} value={password} />
                <input type='password' name='passwordConfirmation' placeholder='Confirm Password' onChange={this.handleChange} value={passwordConfirmation} />
                <button type='submit' className='button-primary' disabled={loading || this.validateForm()}>Submit</button>
                {error && <Error error={error} />}
              </form>
            )
          }
          }

        </Mutation>
      </div>
    )
  }
}

export default withRouter(Signup)
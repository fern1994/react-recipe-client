import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'

import { SIGNIN_USER } from '../../queries'
import Error from './Error'

const initailState = {
  username: '',
  password: '',
}

class Signin extends Component {
  state = { ...initailState }

  clearState = () => {
    this.setState({ ...initailState })
  }

  handleChange = event => {
    const { name, value } = event.target
    this.setState({ [name]: value })
  }

  handleSubmit = (event, signinUser) => {
    event.preventDefault()
    signinUser().then(async ({ data: { signinUser } }) => {
      localStorage.setItem('token', signinUser.token)
      await this.props.refetch()
      this.clearState()
      this.props.history.push('/')
    })
  }

  validateForm = () => {
    const { username, password } = this.state
    const isInvalid = !username || !password
    return isInvalid
  }

  render() {
    const { username, email, password, passwordConfirmation } = this.state
    return (
      <div className='App'>
        <h2 className='App'>Signin</h2>
        <Mutation mutation={SIGNIN_USER} variables={{ username, password }}>
          {(signinUser, { data, loading, error }) => {
            return (
              <form className='form' onSubmit={event => this.handleSubmit(event, signinUser)}>
                <input type='text' name='username' placeholder='Username' onChange={this.handleChange} value={username} />
                <input type='password' name='password' placeholder='Password' onChange={this.handleChange} value={password} />
                <button type='submit' className='button-primary' disabled={loading || this.validateForm()}>Signin</button>
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

export default withRouter(Signin)
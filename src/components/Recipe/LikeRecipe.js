import React, { Component } from 'react'
import withSession from '../withSession'
import { Mutation } from 'react-apollo'
import { LIKE_RECIPE, GET__RECIPE, UNLIKE_RECIPE } from '../../queries'

class LikeRecipe extends Component {
  state = {
    liked: false,
    username: ''
  }

  componentDidMount() {
    if (this.props.session.getCurrentUser) {
      const { username, favorites } = this.props.session.getCurrentUser
      const { _id } = this.props
      const prevLiked = favorites.findIndex(favorite => favorite._id === _id) > -1
      this.setState({
        liked: prevLiked,
        username
      })
    }
  }

  handleClick = async (likeRecipe, unlikeRecipe) => {
    await this.setState(prevState => ({
      liked: !prevState.liked
    }))
    this.handleLike(likeRecipe, unlikeRecipe)
  }

  handleLike = (likeRecipe, unlikeRecipe) => {
    if (this.state.liked) {
      likeRecipe().then(async ({ data }) => {
        await this.props.refetch()
      })
    } else {
      unlikeRecipe().then(async ({ data }) => {
        await this.props.refetch()
      })
    }
  }

  updateLike = (cache, { data: { likeRecipe } }) => {
    const { _id } = this.props
    const { getRecipe } = cache.readQuery({ query: GET__RECIPE, variables: { _id } })

    cache.writeQuery({
      query: GET__RECIPE,
      variables: { _id },
      data: {
        getRecipe: { ...getRecipe, likes: likeRecipe.likes + 1 }
      }
    })
  }


  updateUnlike = (cache, { data: { unlikeRecipe } }) => {
    const { _id } = this.props
    const { getRecipe } = cache.readQuery({ query: GET__RECIPE, variables: { _id } })

    cache.writeQuery({
      query: GET__RECIPE,
      variables: { _id },
      data: {
        getRecipe: { ...getRecipe, likes: unlikeRecipe.likes - 1 }
      }
    })
  }

  render() {
    const { username, liked } = this.state
    const { _id } = this.props
    return (
      <Mutation
        mutation={UNLIKE_RECIPE}
        variables={{ _id, username }}
        update={this.updateUnlike}
      >
        {
          unlikeRecipe => (
            <Mutation
              mutation={LIKE_RECIPE}
              variables={{ _id, username }}
              update={this.updateLike}
            >
              {
                likeRecipe => (
                  username && <button
                    onClick={() => this.handleClick(likeRecipe, unlikeRecipe)}
                  >
                    {liked ? 'unlike' : 'like'}
                  </button>
                )
              }
            </Mutation>
          )
        }
      </Mutation>
    )
  }
}

export default withSession(LikeRecipe)
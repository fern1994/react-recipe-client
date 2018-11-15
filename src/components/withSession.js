import React from 'react'
import {Query} from 'react-apollo'
import {GET_CURRENT_USER} from '../queries'

const withSession = Component => props => (
  <Query query={GET_CURRENT_USER}>
    {({data,loading,refetch}) => {
      if(loading) return null
      return(
        <Component {...props} refetch={refetch} session={data}/>
      )
    }}
  </Query>
)

/**
 * refetch คือ การ load data ใหม่อีกครั้ง เพราะตอนที่เรา signin ถ้าเรามี token 
 * อยู่แล้วมันจะเป็น getCurrentUser ของเก่าอยู่
 */

export default withSession
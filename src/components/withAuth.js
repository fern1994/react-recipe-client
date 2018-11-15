import React from 'react'
import {Query} from 'react-apollo'
import {Redirect} from 'react-router-dom'
import  {GET_CURRENT_USER} from '../queries'

/** เช็คว่าเราล็อคอินแล้วหรือไม่ โดยเอา เงื่อนไขจาก component ใช้
 * เช่น เราเช็ค session ว่ามี session.getCurrentUser หรือไม่ ถ้ามีให้ render 
 * component นั้น ถ้าไม่ให้ redirect ไปหน้าหลัก
*/
const withAuth = conditionFunc => Component => props => {
  return(<Query query={GET_CURRENT_USER}>
  {
    ({data,loading}) => {
      if(loading) return null

      return conditionFunc(data) ? <Component {...props} /> : <Redirect to='/'/>
    }
  }
  </Query>
  )
}

export default withAuth
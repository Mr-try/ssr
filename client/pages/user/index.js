import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import './index.scss'

export default class User extends Component {
  render() {
    return (
      <div>
        user
        <Link to='/home'>Home</Link>
      </div>
    )
  }
}
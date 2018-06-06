import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import './index.scss'

export default class Home extends Component {
  componentDidMount() {
    // this.props.getHomeInfo()
  }

  componentDidCatch(error, info) {
    // 在这里可以做异常的上报
    console.log('发送错误', error, info)
  }
  render() {
    let {add = 0, count, homeInfo: {name, age}} = this.props
    return (
      <div>
        <p>{count}</p>
        <p>my name is:{name} and age is:{age}</p>
        <button style={{backgroundColor: '#eee'}} onClick={() => add(count + 1)}>增加</button>
        <Link to='/user'>User</Link>
      </div>
    )
  }
}
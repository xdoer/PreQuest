import Taro from '@tarojs/taro'
import { Component } from 'react'
import { create } from '@prequest/miniprogram'

import './app.css'

let requestInstance

const xx = create(Taro.request, {
  getRequestInstance(instance) {
    requestInstance = instance
  }
})

xx.post('http://localhost:10000/api').then(e => console.log('xx', e))

class App extends Component {

  componentDidMount() {
  }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children
  }
}

export default App

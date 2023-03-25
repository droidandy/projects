import React, { Component } from 'react'

import Fail from './components/Fail'
import Over from './components/Over'
import Upload from './components/Upload'
import Load from './components/Load'
import Preview from './components/Preview'

class DnD extends Component {
  state = {
    type: 'upload'
  }

  componentWillReceiveProps(newProps) {
    const { type } = newProps
    if (this.state.type !== type) {
      this.setState({ type })
    }
  }

  render() {
    const { type } = this.state
    switch (type) {
      case 'upload':
        return <Upload { ...this.props } dragEnter={ this.dragEnter } dragLeave={ this.reset } onChange={ this.upload } />
      case 'over':
        return <Over { ...this.props } dragEnter={ this.dragEnter } dragLeave={ this.reset } drop={ this.drop } />
      case 'load':
        return <Load { ...this.props } />
      case 'fail':
        return <Fail { ...this.props } onClick={ this.reset } />
      case 'preview':
        return <Preview { ...this.props } dragEnter={ () => this.dragEnter('preview') } dragLeave={ this.reset } onChange={ this.upload } />
      default:
        return <Upload { ...this.props } dragEnter={ this.dragEnter } dragLeave={ this.reset } onChange={ this.upload } />
    }
  }

  dragEnter = (isPreview) => {
    if (isPreview) {
      this.setState({
        type: 'over',
        isPreview: true
      })
    } else {
      this.setState({ type: 'over' })
    }
  }

  reset = () => {
    const { isPreview } = this.state
    if (isPreview) {
      this.setState({
        type: 'preview',
        isPreview: false
      })
    } else {
      this.setState({ type: 'upload' })
    }
  }

  drop = (data, e) => {
    if (e.dataTransfer &&
      e.dataTransfer.items &&
      e.dataTransfer.items[0] &&
      e.dataTransfer.items[0].kind === 'file') {
      const file = e.dataTransfer.items[0].getAsFile()
      const reader = new FileReader()

      reader.onloadend = () => {
        if (this.props.upload) this.props.upload(file)
      }

      reader.readAsDataURL(file)
      this.setState({
        type: 'load'
      })
    } else {
      this.setState({
        type: 'fail'
      })
    }
  }

  upload = (e) => {
    const reader = new FileReader()
    const file = e.target.files[0]

    if (!file) return

    reader.onloadend = () => {
      if (this.props.upload) this.props.upload(file)
    }

    reader.readAsDataURL(file)
    this.setState({
      type: 'load'
    })
  }
}

export default DnD

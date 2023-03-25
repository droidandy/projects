import React, { Component } from 'react'
import { omit } from 'lodash'

function filterProps(props) {
  const forbidden = ['types', 'className', 'enabled', 'wrapperComponent']
  return omit(props, forbidden)
}

class Droppable extends Component {
  static defaultProps = {
    enabled: true
  }

  state = {
    over: false
  }

  componentDidMount() {
    const node = this.refs.droppable
    this.position = {
      top: node.offsetTop + 5,
      left: node.offsetLeft + 5,
      right: node.offsetLeft + node.offsetWidth - 5,
      bottom: node.offsetTop + node.offsetHeight - 5
    }
  }

  render() {
    let Tag = 'div'
    const props = { ...this.props }
    const { over } = this.state
    const classes = ['Droppable', props.className, over && 'over'].filter(Boolean).join(' ')

    return (
      <Tag ref="droppable" className={ classes } { ...filterProps(props) }
        onDrop={ this.onDrop }
        onDragOver={ this.onDragOver }
        onDragEnter={ this.onDragEnter }
        onDragLeave={ this.onDragLeave }
        onDragExit={ this.onDragLeave }>
        {props.children}
      </Tag>
    )
  }

  onDragOver = (e) => {
    e.preventDefault()
    const { onDragOver } = this.props
    if (typeof onDragOver === 'function') {
      onDragOver(e)
    }
  }

  onDragEnter = (e) => {
    e.preventDefault()
    if (this.state.over) return
    const { onDragEnter } = this.props
    if (typeof onDragEnter === 'function') onDragEnter(e)
    this.setState({ over: true })
  }

  onDragLeave = (e) => {
    e.preventDefault()
    const { onDragLeave } = this.props
    const { left, right, top, bottom } = this.position
    let over = true
    if (e.clientX <= left || e.clientX >= right) over = false
    if (e.clientY <= top || e.clientY >= bottom) over = false
    if (over) return
    this.setState({ over: false })
    if (typeof onDragLeave === 'function') {
      onDragLeave(e)
    }
  }

  onDrop = (e) => {
    e.preventDefault()
    this.setState({ over: false })
    let props = { ...this.props }
    const data = !props.types ? null : [].concat(props.types).reduce((d, type) => {
      d[type] = e.dataTransfer.getData(type)
      return d
    }, {})
    if (typeof props.onDrop === 'function') {
      props.onDrop(data, e)
    }
  }
}

export default Droppable

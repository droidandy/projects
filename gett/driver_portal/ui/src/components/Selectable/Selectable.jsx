import React from 'react'
import { filter, size } from 'lodash'

class Selectable extends React.Component {
  static defaultProps = {
    byField: 'id'
  }

  state = {
    selected: {}
  }

  render() {
    return this.props.render({
      isSelected: this.isSelected,
      select: this.select,
      selected: this.selected,
      selectedCount: this.selectedCount
    })
  }

  isSelected = (id) => {
    return this.state.selected['all'] || this.state.selected[id] || false
  }

  select = (id) => {
    if (this.isSelected('all') && id !== 'all') {
      return
    }

    this.setState(state => ({
      ...state,
      selected: { ...state.selected, [id]: !state.selected[id] }
    }))
  }

  selected = () => {
    const { byField, collection } = this.props
    return filter(collection, element => this.isSelected(element[byField]))
  }

  selectedCount = () => {
    if (this.isSelected('all')) {
      return size(this.props.collection)
    }

    return size(this.selected())
  }
}

export default Selectable

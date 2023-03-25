import { Component } from 'react'
import { difference, isEmpty, isArray } from 'lodash'
import PropTypes from 'prop-types'

export default (permission, Element) => {
  const ResultComponent = class extends Component {
    componentWillMount() {
      this.permissionsStatus = this.show
    }

    render() {
      if (this.permissionsStatus) return Element
      return null
    }

    get show() {
      const { currentUser } = this.context
      if (!isArray(permission)) permission = [permission]
      if (currentUser && currentUser.permissions) { return isEmpty(difference(permission, currentUser.permissions)) }
      return false
    }
  }

  ResultComponent.contextTypes = {
    currentUser: PropTypes.object
  }

  return ResultComponent
}

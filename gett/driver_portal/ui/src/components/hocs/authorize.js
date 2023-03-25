import React, { Component } from 'react'
import { difference, isEmpty, isArray, forEach } from 'lodash'
import withCurrentUser from './withCurrentUser'

export const hasRoles = (currentUser, ...roles) => {
  return isEmpty(difference(roles, currentUser.roles))
}

export default (resolver, fallback) => (ComposedComponent) => {
  const ResultComponent = class extends Component {
    render() {
      const { currentUser } = this.props
      if (isArray(resolver)) {
        let component = null
        forEach(resolver, func => {
          if (func(currentUser)) {
            component = <ComposedComponent { ...this.props } />
          }
        })
        if (component) return component
      } else if (resolver(currentUser)) {
        return <ComposedComponent { ...this.props } />
      }

      return fallback ? fallback(currentUser) : null
    }
  }

  return withCurrentUser(ResultComponent)
}

import React, { Component } from 'react'

import { FrontOfficeLayout } from 'containers/Layouts'
import { Documents } from 'containers/Documents'

class UserDocuments extends Component {
  render() {
    const {
      currentUser, logout, history: { location },
      setVehicle, hideLayoutScroll, showLayoutScroll
    } = this.props
    return (
      <div>
        <FrontOfficeLayout
          currentUser={ currentUser }
          logout={ logout }
          location={ location }
          setVehicle={ setVehicle }
        >
          <Documents
            title="Documents"
            setVehicle={ setVehicle }
            hideLayoutScroll={ hideLayoutScroll }
            showLayoutScroll={ showLayoutScroll }
          />
        </FrontOfficeLayout>
      </div>
    )
  }
}

export default UserDocuments

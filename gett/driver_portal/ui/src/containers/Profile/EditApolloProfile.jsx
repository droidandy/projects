import React, { PureComponent } from 'react'
import { FrontOfficeLayout } from 'containers/Layouts'
import { bindState } from 'components/form'
import EditApolloProfileForm from './components/EditApolloProfileForm'
import { connect } from 'react-redux'
import { mapStateToProps } from './reducers'
import * as mapDispatchToProps from './actions'

class EditApolloProfile extends PureComponent {
  state = {}

  componentDidMount() {
    this.props.initialize()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser && !this.state.form) {
      this.setState({ form: nextProps.currentUser })
    }
    if (nextProps.update.errors !== this.props.update.errors) {
      this.form.setErrors(nextProps.update.errors)
    }
  }

  render() {
    const {
      currentUser,
      logout,
      avatar,
      history: { location },
      update: { loading },
      setVehicle
    } = this.props

    return (
      <FrontOfficeLayout currentUser={ currentUser } logout={ logout } location={ location } setVehicle={ setVehicle } >
        <EditApolloProfileForm
          ref={ form => this.form = form }
          { ...bindState(this) }
          onRequestSave={ this.updateUser }
          updateAvatar={ this.updateAvatar }
          loading={ loading }
          avatar={ avatar }
        />
      </FrontOfficeLayout>
    )
  }

  updateUser = (user) => {
    this.props.updateUser({ user, history: this.props.history, url: 'profile' })
  }

  updateAvatar = (file) => {
    this.props.updateAvatar({ file, history: this.props.history })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditApolloProfile)

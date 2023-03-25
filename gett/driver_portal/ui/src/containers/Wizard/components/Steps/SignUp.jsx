import React, { Component } from 'react'
import { bindState } from 'components/form'
import { SignUpForm } from '../Forms'

class SignUp extends Component {
  componentDidMount() {
    this.setState({ form: this.props.currentUser })
  }

  componentWillReceiveProps(nextProps) {
    const { currentUser, errors } = this.props
    this.setState({ form: currentUser })
    if (errors !== this.props.errors) {
      this.form.setErrors(errors)
    }
  }

  signUpUser = (user) => {
    this.props.onRequestSave(user, 0)
  }

  render() {
    return (
      <div>
        <SignUpForm
          ref={ form => this.form = form }
          { ...bindState(this) }
          onRequestSave={ this.signUpUser }
        />
      </div>
    )
  }
}

export default SignUp

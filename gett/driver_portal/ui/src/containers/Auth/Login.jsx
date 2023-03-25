import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { AnonymousLayout } from 'containers/Layouts'
import { TextField } from 'components/TextField'
import { Button } from 'components/Button'
import { IconMail, IconPassword } from 'components/Icons'
import { Link } from 'react-router-dom'
import * as mapDispatchToProps from './actions'
import { mapStateToProps } from './reducers'
import { Tip } from './components/Tip'

class Login extends Component {
  state = {
    attrs: {
      email: '',
      password: ''
    },
    showTips: false,
    errors: {}
  }

  componentDidMount() {
    const showTips = !localStorage.getItem('showTips')
    if (showTips) {
      localStorage.setItem('showTips', true)
      this.setState({ showTips })
    }
  }

  componentWillMount() {
    this.props.initialize()
  }

  render() {
    const session = {
      ...this.props.session,
      ...this.state.attrs,
      errors: {
        ...this.props.session.errors,
        ...this.state.errors
      }
    }
    const { showTips } = this.state

    return (
      <AnonymousLayout>
        <LoginForm>
          <TextField
            type="email"
            value={ session.email }
            onChange={ this.update('email') }
            placeholder="Email"
            prefix={ <IconMail color="#a8a8b5" /> }
            errors={ session.errors.email }
          />
          {
            showTips &&
            <Tip>
              <p>
                We have set up your account with the same email address we use to send you your weekly statement and our newsletter.
              </p>
            </Tip>
          }
          <TextField
            type="password"
            value={ session.password }
            onChange={ this.update('password') }
            placeholder="Password"
            prefix={ <IconPassword color="#a8a8b5" /> }
            errors={ session.errors.password || session.errors.base }
          />

          <ForgotPassword to="/auth/forgot">
            Forgot password?
          </ForgotPassword>
          {
            showTips &&
            <Tip>
              <p>
              The password must have one uppercase letter, one lowercase letter, one number and one special character (%$£!@&). An example would be 'GettP@ssword2011
              </p>
            </Tip>
          }
          <Buttons>
            <Button onClick={ this.login }>
              Log In
            </Button>
          </Buttons>
        </LoginForm>
      </AnonymousLayout>
    )
  }

  login = () => {
    const session = { ...this.props.session, ...this.state.attrs }
    this.setState({ errors: {} })
    this.props.login(session)
  }

  update = (field) => (val) => {
    this.setState(state => ({
      ...state,
      attrs: { ...state.attrs, [field]: val },
      errors: { ...state.errors, [field]: [] }
    }))
  }
}

const LoginForm = styled.div`
  display: flex;
  align-items: justify;
  flex-direction: column;
`

const ForgotPassword = styled(Link)`
  font-size: 14px;
  color: #4373d7;
  text-decoration: underline;
  margin-top: 10px;
  text-align: right;
`

const Buttons = styled.div`
  margin: 30px auto;
`

export default connect(mapStateToProps, mapDispatchToProps)(Login)

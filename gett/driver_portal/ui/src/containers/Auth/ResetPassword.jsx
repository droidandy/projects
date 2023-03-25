import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { AnonymousLayout } from 'containers/Layouts'
import { TextField } from 'components/TextField'
import { IconMail } from 'components/Icons'
import { Button } from 'components/Button'
import { Link } from 'react-router-dom'
import * as mapDispatchToProps from './actions'
import { mapStateToProps } from './reducers'

class ResetPassword extends Component {
  state = {
    attrs: {
      email: ''
    },
    errors: {}
  }

  componentWillMount() {
    this.props.initialize()
  }

  render() {
    const reset = {
      ...this.props.reset,
      ...this.state.attrs,
      errors: {
        ...this.props.reset.errors,
        ...this.state.errors
      }
    }

    return (
      <AnonymousLayout>
        <ResetPasswordForm>
          <Header>Reset Password</Header>
          {
            reset.sent ? (
              <Success>
                <IconMail color="#f6b530" width="55" height="40" />
                <Message>
                  Check your email address and follow <br />
                  the instructions
                </Message>
              </Success>
            ) : (
              <Form>
                <TextField
                  type="email"
                  placeholder="Email"
                  prefix={ <IconMail color="#a8a8b5" /> }
                  value={ reset.email }
                  onChange={ this.update('email') }
                  errors={ reset.errors.email }
                />
                <Buttons>
                  <Button onClick={ this.resetPassword }>
                    Reset now
                  </Button>
                </Buttons>
              </Form>
            )
          }

          <BackToLogin to="/auth">
            Back to Login
          </BackToLogin>
        </ResetPasswordForm>
      </AnonymousLayout>
    )
  }

  resetPassword = () => {
    const { email } = this.state.attrs
    this.props.resetPassword({ email })
  }

  update = (field) => (val) => {
    this.setState(state => ({
      ...state,
      attrs: { ...state.attrs, [field]: val },
      errors: { ...state.errors, [field]: [] }
    }))
  }
}

const ResetPasswordForm = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

const Form = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

const Header = styled.div`
  margin-top: 40px;
  margin-bottom: 30px;
  font-size: 20px;
  font-weight: 500;
  color: #000000;
`

const Buttons = styled.div`
  margin-top: 30px;
`

const BackToLogin = styled(Link)`
  margin-top: 50px;
  font-size: 14px;
  color: #4373d7;
  text-decoration: none;
`

const Success = styled.div`
  text-align: center;
`

const Message = styled.div`
  color: #74818f;
  font-size: 16px;
  margin-top: 20px;
`

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)

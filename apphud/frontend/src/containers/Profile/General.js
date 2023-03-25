import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { NavLink } from 'react-router-dom'

import { updateUserRequest, fetchUserRequest } from '../../actions/user'
import { logoutRequest } from '../../actions/sessions'
import { NotificationManager } from '../../libs/Notifications'
import {track, validation} from "../../libs/helpers"
import TokenService from '../../libs/TokenService'

import styles from './index.module.css'

const tokenService = TokenService.getService()

class General extends Component {
  state = {
    username: this.props.user.username,
    email: this.props.user.email,
    password: '',
    password_confirmation: '',
  }

  componentDidMount() {
    this.props.fetchUserRequest()
  }

  handleChangePassword = (e) => {
    this.setState({ password: e.target.value })
  }

  handleChangePasswordConfirmation = (e) => {
    this.setState({ password_confirmation: e.target.value })
  }

  handleSave = () => {
    this.setState({ submitted: true });
    const {
      email,
      username,
      password,
      password_confirmation
    } = this.state;
    track("profile_saved", { email, username, password_changed: password.length > 0 && password === password_confirmation })
    if (password) {
      if (
        !password ||
        password.length < 8 ||
        password !== password_confirmation ||
        !password_confirmation ||
        email && !validation(email)
      ) {
        return;
      }
      this.props.updateUserRequest({ password, email, username }, () => {
        NotificationManager.success('Settings successfully saved', 'OK', 5000)
        this.handleLogout();
      })
    } else {
      if (!email || !validation(email)) {
        return;
      }
      this.props.updateUserRequest({ email, username }, () => {
        NotificationManager.success('Settings successfully saved', 'OK', 5000)
      })
    }
  }

  handleLogout = () => {
    localStorage.removeItem('persist:primary');
    track("profile_signed_out");
    this.props.logoutRequest(() => {
      tokenService.clearToken()
      window.location.href = '/'
    })
  }

  inputPasswordClasses = () => {
    return classNames('input input_stretch input_blue', {
      input_error: this.state.password &&
        (!this.state.password || this.state.password.length < 8) &&
        this.state.submitted,
    })
  }

  inputEmailClasses = () => {
    return classNames('input input_stretch input_blue', {
      input_error: !this.state.email && !validation(this.state.email, 'email') && this.state.submitted
    })
  }

  inputPasswordConfirmationClass = () => {
    return classNames('input input_stretch input_blue', {
      input_error:
        this.state.password &&
        (!this.state.password_confirmation ||
          this.state.password !== this.state.password_confirmation ||
          this.state.password_confirmation.length < 8) &&
        this.state.submitted,
    })
  }

  render() {
    return (
      <div className="container-content__profile-general">
        <div className="container-content__profile-general__email input-wrapper ta-left">
          <input type="hidden" value="something" />
          <label className="l-p__label" htmlFor="email">
            Name
          </label>
          <div className="input-wrapper__required">
            <input
              value={this.state.username}
              onChange={(e) => this.setState({ username: e.target.value })}
              id="username"
              placeholder="Name"
              type="email"
              name="username"
              required=""
              className={'input input_stretch input_blue'}
            />
          </div>
        </div>
        <div className="container-content__profile-general__email input-wrapper ta-left">
          <input type="hidden" value="something" />
          <label className="l-p__label" htmlFor="email">
            Email
          </label>
          <div className="input-wrapper__required">
            <input
              value={this.state.email}
              autoComplete="new-email"
              onChange={(e) => this.setState({ email: e.target.value })}
              id="newemail"
              placeholder="Email"
              type="email"
              name="newemail"
              required=""
              className={this.inputEmailClasses()}
            />
          </div>
        </div>
        <div className="container-content__integrations-settings__content-title">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 7V6C12 3.794 10.206 2 8 2C5.794 2 4 3.794 4 6V7H3V14H13V7H12ZM8 12C7.172 12 6.5 11.328 6.5 10.5C6.5 9.672 7.172 9 8 9C8.828 9 9.5 9.672 9.5 10.5C9.5 11.328 8.828 12 8 12ZM10 7H6V6C6 4.898 6.897 4 8 4C9.103 4 10 4.898 10 6V7Z"
              fill="#ABD7FF"
            />
          </svg>
          <span>Change password</span>
        </div>
        <div className="container-content__profile-general__form">
          <div className={styles['form-wrapper']}>
            <div className="input-wrapper ta-left">
              <label className="l-p__label" htmlFor="email">
                New password
              </label>
              <input
                value={this.state.password}
                onChange={this.handleChangePassword}
                id="new-password"
                autoComplete="new-password"
                placeholder="New password"
                type="password"
                name="newpassword"
                required=""
                className={this.inputPasswordClasses()}
              />
            </div>
            <div className="input-wrapper__bottom-text">
              Password must contain at least 8 characters
            </div>
            <div className="input-wrapper ta-left">
              <label className="l-p__label" htmlFor="email">
                Repeat password
              </label>
              <input
                value={this.state.password_confirmation}
                onChange={this.handleChangePasswordConfirmation}
                id="repeat-password"
                placeholder="Repeat password"
                type="password"
                name="repeatpassword"
                required=""
                className={this.inputPasswordConfirmationClass()}
              />
            </div>
          </div>
          <div className="input-wrapper ta-left">
            <button
              onClick={this.handleSave}
              className="button button_green l-p__button"
            >
              <span>Save</span>
            </button>
          </div>
        </div>
        <button
          onClick={this.handleLogout}
          className="button button_red fr container-content__profile-general__signout"
        >
          <span>Sign out</span>
        </button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.sessions,
    applications: state.applications,
  }
}

const mapDispatchToProps = {
  updateUserRequest,
  fetchUserRequest,
  logoutRequest,
}

export default connect(mapStateToProps, mapDispatchToProps)(General)

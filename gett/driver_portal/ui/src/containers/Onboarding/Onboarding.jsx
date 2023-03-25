import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { breakpoints } from 'components/Media'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Invite } from './components/Invite'
import Header from './components/Header'
import { mapStateToProps } from './reducers'
import * as mapDispatchToProps from './actions'

class Onboarding extends Component {
  componentWillMount() {
    this.props.initialize()
  }

  componentDidMount() {
    const { match: { params: { token } } } = this.props
    this.props.loadInvite({ token })
  }

  render() {
    const { loading, invite, attrs, errors } = this.props

    if (errors.token) {
      return <Redirect to="/" />
    }

    if (invite.step === 'accepted') {
      return <Redirect to="/" />
    }

    if (loading) {
      return (
        <Page>
          <Header />
          <Main>Loading...</Main>
        </Page>
      )
    }

    return (
      <Page>
        <Header />
        <Main>
          <Invite
            invite={ invite }
            attrs={ attrs }
            errors={ errors }
            onNext={ this.next }
          />
        </Main>
      </Page>
    )
  }

  next = (attrs) => {
    const { token } = this.props.match.params
    this.props.updateInvite({ token, attrs })
  }
}

const Page = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
`

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;

  ${breakpoints.phoneLarge`
    margin-top: 80px;
  `}

  ${breakpoints.desktopSmall`
    margin-top: 50px;
  `}
`

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding)

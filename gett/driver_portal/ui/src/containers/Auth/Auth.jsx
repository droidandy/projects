import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { Loader } from 'components/Loader'
import * as mapDispatchToProps from './actions'
import { mapStateToProps } from './reducers'

class Auth extends Component {
  componentDidMount() {
    const { match: { params: { token } }, auth } = this.props
    auth({ token })
  }

  render() {
    return (
      <Wrapper>
        <Loader color="#FDB924" />
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`

export default connect(mapStateToProps, mapDispatchToProps)(Auth)

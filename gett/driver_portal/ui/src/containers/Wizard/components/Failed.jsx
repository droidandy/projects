import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { media } from 'components/Media'
import { IconErrorOutline } from 'components/Icons'
import { Button } from 'components/Button'

const errors = {
  requirementsFail: 'Sorry you haven\'t met the requirements to join Gett this time. Please, reschedule at a later date as advised on your welcome day.',
  personalInformationFail: 'Unfortunately you don\'t meet the requirements to work with Gett at this time. We require drivers to have a high driver rating and to have covered a minimum of 100 rides. You will still have access to our driver portal should things change in the future. We hope to see you again.'
}

class Failed extends PureComponent {
  static propTypes = {
    onTryAgain: PropTypes.func,
    text: PropTypes.string
  }

  static defaultProps = {
    text: 'requirementsFail'
  }

  render() {
    const { onTryAgain, text } = this.props

    return (
      <Wrapper>
        <IconErrorOutline color="#f00" width={ 60 } height={ 60 } />
        <Text>{ errors[text] }</Text>
        <ButtonStyled onClick={ onTryAgain }>Try Again</ButtonStyled>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  text-align: center;
  margin-top: 15vh;
  ${media.phoneLarge`
    width: 90%;
    margin: auto;
    background-color: #fff;
    padding: 30px 20px 40px 20px;
  `}
`

const Text = styled.div`
  max-width: 480px;
  margin: 30px auto;
  font-size: 14px;
  line-height: 1.5;
  color: #303030;
`

const ButtonStyled = styled(Button)`
  background: #fff;
  border: 1px solid #f6b530;
`

export default Failed

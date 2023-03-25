import React, { PureComponent } from 'react'
import { IconSuccessOutline } from 'components/Icons'
import styled from 'styled-components'

class WelcomeSession extends PureComponent {
  render() {
    return (
      <Wrapper>
        <IconSuccessOutline color="#6bc11a" width={ 60 } height={ 60 } />
        <Text>
          All your documents have been received and are pending approval.
          You can change your documents at any time using the upload buttons above.
          Please remember to bring all your documents (originals, not copies) to your welcome session so we can verify them.
          Thank you.
        </Text>
        <Border />
        <Text>
          Please don't forget your appointment with us. Check your email for confirmation and time
        </Text>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  text-align: center;
  margin-top: 15vh;
`

const Text = styled.div`
  max-width: 480px;
  margin: 30px auto;
  font-size: 14px;
  line-height: 1.5;
  color: #303030;
`

const Border = styled.hr`
  border: 1px solid #d8d8d8;
  max-width: 574px;
`

export default WelcomeSession

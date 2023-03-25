import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { media } from 'components/Media'
import { FrontOfficeLayout } from 'containers/Layouts'

import { Message } from './components'
import * as mapDispatchToProps from './actions'
import { mapStateToProps } from './reducers'

import messageContact from 'assets/images/message-contact@2x.png'
import phoneContact from 'assets/images/phone-contact@2x.png'

class ContactUs extends Component {
  render() {
    const { currentUser, logout, history: { location }, sendMessage, loading, setVehicle } = this.props

    return <FrontOfficeLayout
      setVehicle={ setVehicle }
      currentUser={ currentUser }
      logout={ logout }
      location={ location }>
      <PageHeader>
        <PageName>
          Contact us
        </PageName>
      </PageHeader>
      <Container>
        <Wrapper>
          <Column>
            <Title>
              Send your message to our support team
            </Title>
            <Img src={ messageContact } />
            <MessageStyled onSend={ sendMessage } loading={ loading } />
          </Column>
          <ColumnLeft>
            <Title>
              Speak to our support team
            </Title>
            <Img src={ phoneContact } />
            <InfoContainer>
              <Text>
                Customer Care
              </Text>
              <ImportantText>
                0207 561 5010
              </ImportantText>
              <LastBlock>
                <Text>
                  Driver Support
                </Text>
                <ImportantText>
                  drivers.uk@gett.com
                </ImportantText>
              </LastBlock>
            </InfoContainer>
            <Bold>24/7</Bold>
            <Text>Everyday</Text>
          </ColumnLeft>
        </Wrapper>
      </Container>
    </FrontOfficeLayout>
  }
}

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  background: #f4f7fa;
  padding: 30px;
  
  ${media.phoneLarge`
    padding: 15px;
  `}
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  
  ${media.phoneLarge`
    flex-direction: column;
    justify-content: none;
  `}
`

const PageHeader = styled.div`
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
`

const PageName = styled.span`
  font-size: 36px;
  color: #303030;
  margin-left: 30px;
  
  ${media.phoneLarge`
    margin-left: 15px;
  `}
`

const Column = styled.div`
  width: 50%;
  background: #fff;
  min-height: 500px;
  padding-top: 50px;
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  ${media.desktopSmall`
    padding: 50px 20px 20px 30px;
  `}
  
  ${media.phoneLarge`
    width: 100%;
  `}
`

const ColumnLeft = styled(Column)`
  margin-left: 40px;
  
  ${media.phoneLarge`
    margin-left: 0;
    margin-top: 40px;
  `}
`

const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
`

const Img = styled.img`
  width: 400px;
  height: 400px;
  margin-top: 60px;
  
  ${media.desktopMedium`
    width: 230px;
    height: 230px;
  `}
  
  ${media.tablet`
    width: 180px
    height: 180px;
  `}
`

const MessageStyled = styled(Message)`
  max-width: 400px;
  margin-top: 45px;
`

const InfoContainer = styled.div`
  width: 280px;
  border-bottom: 1px solid #d2dadc;
  text-align: center;
  padding-bottom: 20px;
  margin: 45px 0 20px;
`

const ImportantText = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #f6b530;
  margin-top: 5px;
`

const Text = styled.div`
  font-size: 14px;
  color: #a9b1ba;
`

const Bold = styled.div`
  font-weight: bold;
  line-height: 20px;
`

const LastBlock = styled.div`
  margin-top: 15px;
`

export default connect(mapStateToProps, mapDispatchToProps)(ContactUs)

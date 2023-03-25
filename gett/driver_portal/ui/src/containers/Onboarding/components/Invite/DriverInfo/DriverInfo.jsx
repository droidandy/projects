import React from 'react'
import styled from 'styled-components'
import { Avatar } from 'components/Avatar'
import MediaQuery from 'react-responsive'
import { breakpoints, sizes } from 'components/Media'
import Field from './Field'
import GettId from './GettId'

const DriverInfo = ({ invite }) => (
  <Wrapper>
    <Driver>
      <MediaQuery maxWidth={ sizes.phoneLarge - 1 }>
        <DriverAvatar user={ invite.user } width={ 80 } height={ 80 } />
      </MediaQuery>
      <MediaQuery minWidth={ sizes.phoneLarge }>
        <DriverAvatar user={ invite.user } width={ 130 } height={ 130 } />
      </MediaQuery>
      <Personal>
        <Name>{ `${invite.user.firstName} ${invite.user.lastName}` }</Name>
        <GettId label="Gett ID:">{ invite.user.gettId }</GettId>
      </Personal>
    </Driver>
    <Info>
      { invite.user.location.city && <Field label="City">{ invite.user.location.city}</Field> }
      { invite.user.location.address && <Field label="Address">{ invite.user.location.address}</Field> }
      { invite.user.phone && <Field label="Phone">{ invite.user.phone }</Field> }
      { invite.user.email && <Field label="Email">{ invite.user.email }</Field> }
      <Note>
        If information is not correct please contact our Support Team.
      </Note>
    </Info>
  </Wrapper>
)

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 20px 20px 0px 20px;

  ${breakpoints.phoneLarge`
    flex-direction: row;
    margin-top: 80px;
  `}

  ${breakpoints.desktopMedium`
    margin-top: 120px;
  `}
`

const Driver = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 25px;

  ${breakpoints.phoneLarge`
    flex-direction: column;
    justify-content: center;
    margin-right: 95px;
  `}
`

const DriverAvatar = styled(Avatar)`
  margin: 0 25px 0 0;

  ${breakpoints.phoneLarge`
    margin: 0;
  `}
`

const Personal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${breakpoints.phoneLarge`
    margin-top: 20px;
  `}
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: 20px;
`

const Name = styled.div`
  font-size: 18px;
  text-align: left;
  color: #303030;
  font-weight: 400;
  width: 100%;

  ${breakpoints.phoneLarge`
    text-align: center;
  `}
`

const Note = styled.div`
  margin-top: 20px;
  font-size: 14px;
  text-align: center;
  color: #303030;
`

export default DriverInfo

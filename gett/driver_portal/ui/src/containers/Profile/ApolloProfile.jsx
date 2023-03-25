import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FrontOfficeLayout } from 'containers/Layouts'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Avatar } from 'components/Avatar'
import { ButtonLink } from 'components/Button'
import { Field, Stats } from './components'
import { disabilityTypes } from './components/data'
import { IconSuccessOutline, IconErrorOutline, IconCash, IconCard, IconTips, IconAccountPayment, IconMiles } from 'components/Icons'
import { media } from 'components/Media'
import { mapStateToProps } from './reducers'
import * as mapDispatchToProps from './actions'

class ApolloProfile extends Component {
  static propTypes = {
    currentUser: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      email: PropTypes.string,
      avatarUrl: PropTypes.string,
      gettId: PropTypes.number,
      address: PropTypes.string,
      city: PropTypes.string,
      postcode: PropTypes.string,
      phone: PropTypes.string,
      birthDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      hobbies: PropTypes.string,
      drivingCabSince: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      sortCode: PropTypes.string,
      accountNumber: PropTypes.string
    }),
    statistic: PropTypes.object,
    setVehicle: PropTypes.func
  }

  componentDidMount() {
    this.props.loadStats()
    this.props.loadDistance()
  }

  render() {
    const { currentUser, logout, statistic: { stats, distance }, history: { location }, setVehicle } = this.props

    return (
      <FrontOfficeLayout currentUser={ currentUser } logout={ logout } location={ location } setVehicle={ setVehicle } >
        <PageHeader>
          <PageName>Profile</PageName>
          <ButtonStyled to="profile/edit">Edit</ButtonStyled>
        </PageHeader>
        <Container>
          <StatsWrapper>
            <StatsItem>
              <IconSuccessOutline width={ 24 } height={ 24 } color="#f6b530" />
              <Stats value={ stats && stats.completedOrders } label="Completed" />
            </StatsItem>
            <StatsItem>
              <IconErrorOutline width={ 24 } height={ 24 } color="#f6b530" />
              <Stats value={ stats && stats.cancelledOrders } label="Cancelled" />
            </StatsItem>
            <StatsItem>
              <IconCash width={ 24 } height={ 24 } color="#f6b530" />
              <Stats value={ stats && stats.cashFare } label="Cash" prefix="£" />
            </StatsItem>
            <StatsItem>
              <IconAccountPayment width={ 24 } height={ 24 } color="#f6b530" />
              <Stats value={ stats && stats.accountFare } label="Account" prefix="£" />
            </StatsItem>
            <StatsItem>
              <IconCard width={ 24 } height={ 24 } color="#f6b530" />
              <Stats value={ stats && stats.cardFare } label="Card" prefix="£" />
            </StatsItem>
            <StatsItem>
              <IconTips width={ 24 } height={ 24 } color="#f6b530" />
              <Stats value={ stats && stats.tips } label="Tips" prefix="£" />
            </StatsItem>
            <StatsItem>
              <IconMiles width={ 24 } height={ 24 } color="#f6b530" />
              <Stats value={ distance && distance.toFixed(2) } label="Miles" />
            </StatsItem>
          </StatsWrapper>
          <Wrapper>
            <Info>
              <Title>Information</Title>
              <InfoWrapper>
                <Driver>
                  <AvatarStyled user={ currentUser } />
                  <DriverNameWrapper>
                    <DriverName>
                      { currentUser.firstName} {currentUser.lastName }
                    </DriverName>
                    <div>
                      <DriverId>Gett ID:&nbsp;</DriverId>
                      <DriverIdNumber>{ currentUser.gettId }</DriverIdNumber>
                    </div>
                  </DriverNameWrapper>
                </Driver>

                <Details>
                  <Field label="City of residence" value={ currentUser.city } />
                  <Field label="Home address" value={ currentUser.address } />
                  <Field label="Postcode" value={ currentUser.postcode } />
                  <Field label="Phone" value={ currentUser.phone } />
                  <Field label="Email" value={ currentUser.email } />
                  <Field label="NINO" value={ currentUser.insuranceNumber } />
                  <Field label="TFL" value={ currentUser.licenseNumber } />
                </Details>

                <Details>
                  <Field label="Date of birth" value={ currentUser.birthDate } />
                  <Field label="My interests & hobbies" value={ currentUser.hobbies } />
                  <Field label="I like to talk about" value={ currentUser.talkingTopics } />
                  <Field label="Driving a cab since" value={ currentUser.drivingCabSince } />
                  <Field label="Please, know that I am" value={ disabilityTypes[currentUser.disabilityType] } />
                </Details>
              </InfoWrapper>
            </Info>
            <BankingInfo>
              <Title>Banking Information</Title>
              <BankingWrapper>
                <SortCodeField label="Sort Code" value={ currentUser.sortCode } />
                <Field label="Account Number" value={ currentUser.accountNumber } />
              </BankingWrapper>
            </BankingInfo>
          </Wrapper>
        </Container>
      </FrontOfficeLayout>
    )
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

const PageHeader = styled.div`
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: space-between;
  margin: 20px 30px 0 0;

  ${media.phoneLarge`
    margin-right: 15px;
  `}
`

const PageName = styled.span`
  font-size: 36px;
  color: #303030;
  margin-left: 30px;
`

const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #000;
`

const ButtonStyled = styled(ButtonLink)`
  width: 80px;

  ${media.phoneLarge`
    width: 60px;
  `}
`

const Driver = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 25px;

  ${media.phoneMedium`
    width: 100%;
  `}

  ${media.phoneSmall`
    display: flex;
    width: 100%;
  `}
`

const DriverName = styled.div`
  font-size: 24px;
  color: #303030;
  margin-top: 20px;
  margin-bottom: 4px;

  ${media.phoneSmall`
    font-size: 18px;
  `}
`

const DriverNameWrapper = styled.div`
  ${media.phoneSmall`
    text-align: left;
  `}
`

const DriverId = styled.span`
  font-size: 16px;
  color: #a9b1ba;

  ${media.phoneSmall`
    font-size: 14px;
  `}
`

const DriverIdNumber = styled(DriverId)`
  font-weight: 500;
  color: #282c37;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: start;

  ${media.phoneLarge`
    flex-direction: column;
    justify-content: none;
  `}
`

const InfoWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: start;

  ${media.phoneMedium`
    flex-direction: column;
    justify-content: none;
  `}
`

const AvatarStyled = styled(Avatar)`
  ${media.phoneSmall`
    width: 80px;
    height: 80px;
    margin-right: 25px;
  `}
`

const StatsWrapper = styled.div`
  min-height: 100px;
  width: 100%;
  background: #fff;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`

const StatsItem = styled.div`
  display: flex;
  padding: 30px;
  justify-content: center;

  ${media.phoneLarge`
    padding: 15px;
  `}
`

const Info = styled.div`
  width: 70%;
  background: #fff;
  margin-right: 20px;
  padding: 20px 25px;
  border-radius: 4px;
  margin-bottom: 20px;

  ${media.phoneLarge`
    width: 100%;
  `}
`

const BankingInfo = styled.div`
  width: 30%;
  background: #fff;
  padding: 20px 25px;
  border-radius: 4px;
  margin-bottom: 20px;

  ${media.phoneLarge`
    width: 100%;
  `}
`

const Details = styled.div`
  width: 30%;

  ${media.phoneMedium`
    width: 100%;
  `}
`

const BankingWrapper = styled.div`
  display: flex;
`

const SortCodeField = styled(Field)`
  margin-right: 50px;

  ${media.phoneSmall`
    width: 50%;
    margin-right: 10px;
  `}
`

export default connect(mapStateToProps, mapDispatchToProps)(ApolloProfile)

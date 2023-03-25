import React, { Component } from 'react'
import { FrontOfficeLayout } from 'containers/Layouts'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { isEqual } from 'lodash'

import { Avatar } from 'components/Avatar'
import { Button } from 'components/Button'
import { Field, Stats, EditProfileDialog } from './components'
import {
  IconSuccessOutline, IconErrorOutline, IconCash, IconCard, IconTips,
  IconAccountPayment, IconMiles
} from 'components/Icons'
import { media } from 'components/Media'
import { Loader } from 'components/Loader'

import { mapStateToProps } from './reducers'
import * as mapDispatchToProps from './actions'

class Profile extends Component {
  state = {
    profileEdit: {
      active: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const { update, update: { loading } } = nextProps
    if (!isEqual(update, this.props.update) && !loading) {
      this.setState({ profileEdit: { active: false } })
    }
  }

  componentWillMount() {
    this.props.initialize()
  }

  componentDidMount() {
    this.props.loadStats()
    this.props.loadDistance()
  }

  render() {
    const {
      currentUser,
      logout,
      statistic: { stats, distance, loading },
      update,
      history: { location },
      history,
      updateUser,
      setVehicle
    } = this.props
    const { profileEdit } = this.state

    return <FrontOfficeLayout setVehicle={ setVehicle } currentUser={ currentUser } logout={ logout } location={ location }>
      <PageHeader>
        <PageName>
          Profile
        </PageName>
        {
          loading ? <LoaderStyled color="#FDB924" />
            : <ButtonStyled onClick={ this.openEdit }>
              Edit
            </ButtonStyled>
        }
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
            <Title>
              Information
            </Title>
            <Driver>
              <Avatar user={ currentUser } />
              <DriverName>
                {`${currentUser.firstName} ${currentUser.lastName}`}
              </DriverName>
              <div>
                <DriverId>Gett ID:</DriverId>
                <DriverIdNumber>{` ${currentUser.gettId}`}</DriverIdNumber>
              </div>
            </Driver>
            <Field label="City" value={ currentUser.location && currentUser.location.city } />
            <Field label="Phone" value={ currentUser.phone } />
            <Field label="Company phone" value={ currentUser.companyPhone } />
            <Field label="Email" value={ currentUser.email } />
          </Info>
          <DetailsWrapper>
            <Details>
              <CarDetails>
                <Title>
                  Vehicle Details
                </Title>
                <Field label="Cab registration number" value={ currentUser.vehicleReg } />
                <Field label="Vehicle colour" value={ currentUser.vehicleColour } />
                <Field label="Vehicle model" value={ currentUser.vehicleType } valueUnder={ currentUser.vehicleColor } />
                <Field label="Badge Type" value={ currentUser.badgeType } />
                <Field label="Badge number" value={ currentUser.badgeNumber } />
              </CarDetails>
              <Banking>
                <Title>
                  Banking Information
                </Title>
                <Field label="Sort Code" value={ currentUser.sortCode } />
                <Field label="Account Number" value={ currentUser.accountNumber } />
              </Banking>
            </Details>
            {/* <Ratings>
              <Title>
                Ratings
              </Title>
              <Rate
                Icon={ IconAcceptance }
                prefix="%"
                label="Acceptance Rate"
                value={ rating.total_acceptance } />
              <Rate
                Icon={ IconRating }
                label="Driver Rating"
                value={ rating.rating || '0.00' }
              />
            </Ratings>
            */ }
          </DetailsWrapper>
        </Wrapper>
        <EditProfileDialog
          width={ 700 }
          active={ profileEdit.active }
          onClose={ this.closeEdit }
          user={ currentUser }
          updateUser={ updateUser }
          update={ update }
          history={ history }
        />
      </Container>
    </FrontOfficeLayout>
  }

  openEdit = () => {
    this.setState(state => ({
      ...state,
      profileEdit: {
        active: true
      }
    }))
  }

  closeEdit = () => {
    this.setState(state => ({
      ...state,
      profileEdit: {
        active: false
      }
    }))
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
  color: #000000;
`

const ButtonStyled = styled(Button)`
  ${media.phoneLarge`
    width: 60px;
  `}
`

const LoaderStyled = styled(Loader)`
  margin: 0;
`

const Driver = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const DriverName = styled.div`
  font-size: 24px;
  color: #303030;
  margin-top: 20px;
  margin-bottom: 4px;
`

const DriverId = styled.span`
  font-size: 16px;
  color: #a9b1ba;
`

const DriverIdNumber = styled(DriverId)`
  font-weight: 500;
  color: #282c37;
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;

  ${media.phoneLarge`
    flex-direction: column;
    justify-content: none;
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
  width: 30%;
  background: #fff;
  min-height: 500px;
  min-width: 320px;
  margin-right: 20px;
  padding: 25px;

  ${media.desktopMedium`
    min-width: 200px;
  `}

  ${media.tablet`
    min-width: 170px;
    width: 40%;
  `}

  ${media.phoneLarge`
    min-width: 0;
    width: 100%;
    padding: 20px;
  `}
`

const DetailsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  width: 70%;

  ${media.tablet`
    flex-direction: column;
    flex-flow: column-reverse;
    width: 60%;
  `}

  ${media.phoneLarge`
    width: 100%;
    margin-top: 20px;
  `}
`

// const Ratings = styled.div`
//   height: 250px;
//   background: #fff;
//   min-width: 320px;
//   margin-left: 20px;
//   padding: 25px;
//
//   ${media.desktopMedium`
//     min-width: 280px;
//   `}
//
//   ${media.tablet`
//     margin-left: 0px;
//     min-width: 100px;
//   `}
//
//   ${media.phoneLarge`
//     min-width: 0;
//     padding: 20px;
//   `}
// `

const Details = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 430px;

  ${media.desktopMedium`
    min-width: 200px;
  `}

  ${media.tablet`
    min-width: 100px;
    margin-top: 20px;
  `}

  ${media.phoneLarge`
    min-width: 0;
  `}
`

const Banking = styled.div`
  min-height: 200px;
  background: #fff;
  margin-top: 20px;
  padding: 25px;

  ${media.phoneLarge`
    padding: 20px;
  `}
`

const CarDetails = styled.div`
  min-height: 300px;
  background: #fff;
  padding: 25px;

  ${media.phoneLarge`
    padding: 20px;
  `}
`

export default connect(mapStateToProps, mapDispatchToProps)(Profile)

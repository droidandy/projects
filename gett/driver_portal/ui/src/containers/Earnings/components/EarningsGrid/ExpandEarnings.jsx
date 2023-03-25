import React, { Component } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { isEmpty } from 'lodash'
import { Timeline } from '../Timeline'
import { GoogleMap, Marker } from 'components/GoogleMap'
import { DesktopTablet, Tablet } from 'components/MediaQuery'
import { media } from 'components/Media'

class ExpandEarnings extends Component {
  static defaultProps = {
    details: {}
  }

  componentDidMount() {
    const { data, id, onStatementId, loadDetails } = this.props
    if (isEmpty(this.props.details)) {
      loadDetails(data.orderId, data.issuedAt)
    }
    if (data && !data.statementId && data.issuedAt) {
      onStatementId({ earningsId: id, issuedAt: data.issuedAt })
    }
  }

  get earningsPath() {
    const path = []
    const { data: { origin, destination }, details } = this.props
    if (origin) {
      path.start = { lat: origin.latitude, lng: origin.longitude }
    }
    if (destination) {
      path.finish = { lat: destination.latitude, lng: destination.longitude }
    }
    if (details && !isEmpty(details.path)) {
      path.points = details.path
    }

    return path
  }

  get getRideInfo() {
    const { data } = this.props

    return <RideInfoWrapper>
      <RideInfoHistory>
        <History>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
              <path fill="#6BC11A" d="M9.99956987,0 C6.13954774,0 3,3.12640528 3,6.97059894 C3,10.6897364 6.78689935,16.0907086 8.60765638,18.6864815 C8.86745729,19.0573674 9.07607226,19.3537335 9.24038343,19.596137 C9.4046946,19.839397 9.68342141,20 10,20 C10.3165786,20 10.5953054,19.839397 10.7596166,19.596137 C10.9239277,19.3537335 11.1321126,19.0573674 11.3923436,18.685625 C13.2131007,16.0902803 17,10.6893081 17,6.97059894 C16.9991397,3.12640528 13.859592,0 9.99956987,0 Z M9.99956987,9.51583546 C8.59088116,9.51583546 7.4424235,8.37319857 7.4424235,6.97102722 C7.4424235,5.56757104 8.59088116,4.4257907 9.99956987,4.4257907 C11.4104092,4.4257907 12.5567162,5.56757104 12.5567162,6.97102722 C12.5567162,8.37319857 11.4104092,9.51583546 9.99956987,9.51583546 Z" />
            </svg>
          </div>
          <span>{data.origin ? data.origin.fullAddress : ''}</span>
        </History>
        {data.destination && <HistoryFinish>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
              <path fill="#F00" d="M9.99956987,0 C6.13954774,0 3,3.12640528 3,6.97059894 C3,10.6897364 6.78689935,16.0907086 8.60765638,18.6864815 C8.86745729,19.0573674 9.07607226,19.3537335 9.24038343,19.596137 C9.4046946,19.839397 9.68342141,20 10,20 C10.3165786,20 10.5953054,19.839397 10.7596166,19.596137 C10.9239277,19.3537335 11.1321126,19.0573674 11.3923436,18.685625 C13.2131007,16.0902803 17,10.6893081 17,6.97059894 C16.9991397,3.12640528 13.859592,0 9.99956987,0 Z M9.99956987,9.51583546 C8.59088116,9.51583546 7.4424235,8.37319857 7.4424235,6.97102722 C7.4424235,5.56757104 8.59088116,4.4257907 9.99956987,4.4257907 C11.4104092,4.4257907 12.5567162,5.56757104 12.5567162,6.97102722 C12.5567162,8.37319857 11.4104092,9.51583546 9.99956987,9.51583546 Z" />
            </svg>
          </div>
          <span>{data.destination.fullAddress}</span>
        </HistoryFinish>
        }
      </RideInfoHistory>
    </RideInfoWrapper>
  }

  getMarkers() {
    const { data: { origin, destination } } = this.props
    const markers = []

    if (origin) markers.push(<Marker type="start" position={ { lat: origin.latitude, lng: origin.longitude } } />)
    if (destination) markers.push(<Marker type="finish" position={ { lat: destination.latitude, lng: destination.longitude } } />)

    return markers
  }

  render() {
    const { expanded, data, details } = this.props
    const paths = this.earningsPath
    const markers = this.getMarkers
    return <Container showExpandRow={ expanded }>
      <Tablet minWidth={ 0 }>
        {expanded && <GoogleMapStyled
          height={ 180 }
          width={ '100%' }
          paths={ [paths] }
        >
          {markers}
        </GoogleMapStyled>}
      </Tablet>
      {expanded && <DesktopTablet>
        <MapWrapper>
          <GoogleMapStyled
            height={ 360 }
            width={ 300 }
            paths={ [paths] }
          >
            {markers}
          </GoogleMapStyled>
        </MapWrapper>
      </DesktopTablet>}
      <InfoWrapper>
        <ColumnsWrapper>
          <InfoColumn>
            <InfoTitle>Ride Information</InfoTitle>
            {this.getRideInfo}
            <InfoTable>
              <InfoTableLabel>Order ID</InfoTableLabel>
              <InfoTableData>{data.orderId}</InfoTableData>
            </InfoTable>
            <InfoTable>
              <InfoTableLabel>Journey</InfoTableLabel>
              <InfoTableData>{moment.unix(data.journeyTime).format('mm:ss')}</InfoTableData>
            </InfoTable>
            <InfoTable>
              <InfoTableLabel>Distance</InfoTableLabel>
              <InfoTableData>{details && details.distance}</InfoTableData>
            </InfoTable>
          </InfoColumn>
          <InfoColumnSecond>
            <InfoTitle>Payment Information</InfoTitle>
            {data.statementId && <InfoTable>
              <InfoTableLabel>Statement ID</InfoTableLabel>
              <InfoTableData>
                <StatementId to={ `/statements/${data.statementId}` }>{data.statementId}</StatementId>
              </InfoTableData>
            </InfoTable>}
            <InfoTable>
              <InfoTableLabel>Base Fare</InfoTableLabel>
              <InfoTableData>£{data.taxiFare}</InfoTableData>
            </InfoTable>
            <InfoTable>
              <InfoTableLabel>Tips</InfoTableLabel>
              <InfoTableData>£{data.gratuity}</InfoTableData>
            </InfoTable>
            <InfoTable>
              <InfoTableLabel>Commision</InfoTableLabel>
              <InfoTableData>£{data.commission}</InfoTableData>
            </InfoTable>
            <InfoTable>
              <InfoTableLabel>Cancellation Fee</InfoTableLabel>
              <InfoTableData>£{data.cancellationFee}</InfoTableData>
            </InfoTable>
            <InfoTable>
              <InfoTableLabel>Extras</InfoTableLabel>
              <InfoTableData>£{data.extras}</InfoTableData>
            </InfoTable>
            <InfoTable>
              <InfoTableLabel>VAT</InfoTableLabel>
              <InfoTableData>£{data.vat}</InfoTableData>
            </InfoTable>
            <InfoTable>
              <InfoTableLabel>Peak Hour Premium</InfoTableLabel>
              <InfoTableData>£{data.peakHourPremium}</InfoTableData>
            </InfoTable>
            <InfoTable>
              <InfoTableLabel>Waiting Time Cost</InfoTableLabel>
              <InfoTableData>£{data.waiting}</InfoTableData>
            </InfoTable>
          </InfoColumnSecond>
        </ColumnsWrapper>
        <Timeline status={ data.status } events={ details.events } />
      </InfoWrapper>
    </Container>
  }
}

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  border-radius: 0px 0px 4px 4px;
  margin-bottom: 5px;

  ${media.tablet`
    flex-direction: column;
  `}

  visibility: visible;
  opacity: 1;
  height: 100%;

  transition: visibility 0s, opacity 0.5s linear; height 1s ease-out;
  background: #fff;
`

const MapWrapper = styled.div`
  margin: 20px 0px 20px 30px;
`

const InfoWrapper = styled.div`
  padding: 30px;
  flex: 1; 
`

const InfoColumn = styled.div`
  width: 50%;

  ${media.phoneLarge`
    width: auto;
    margin-top: 30px;
  `}
`

const InfoColumnSecond = styled(InfoColumn)`
  margin-left: 30px;
  ${media.phoneLarge`
    margin-left: 0;
  `}

`
const ColumnsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  ${media.phoneLarge`
    flex-direction: column;
    padding: 0px 20px 20px 20px;
  `}
`

const InfoTitle = styled.span`
  font-size: 18px;
  font-weight: bold;
  line-height: 1.33;
  color: #000000;
`

const InfoTable = styled.div`
  margin-top: 10px;
  display: flex;
  font-size: 14px;
  line-height: 1.5;
`

const InfoTableLabel = styled.div`
  color: #727272;
`

const InfoTableData = styled.div`
  font-weight: 500;
  color: #000000;
  margin-left: auto;
`

const GoogleMapStyled = styled(GoogleMap)`
  width: 100%;
`

const RideInfoWrapper = styled.div`
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
`

const History = styled.div`
  display: flex;
  
  span {
    margin-left: 20px;
  }
`

const HistoryFinish = styled(History)`
  margin-top: 20px;
`

const RideInfoHistory = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
`

const StatementId = styled(Link)`
  font-size: 14px;
  font-weight: bold;
  line-height: 1.5;
  color: #f6b530;
`

export default ExpandEarnings

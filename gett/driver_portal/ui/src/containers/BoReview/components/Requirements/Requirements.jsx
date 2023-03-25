import React, { PureComponent, Fragment } from 'react'
import styled from 'styled-components'
import { isEqual } from 'lodash'

import { Loader } from 'components/Loader'
import { bindState } from 'components/form'

import ReviewItem from './ReviewItem'
import PhoneAndContractForm from './PhoneAndContractForm'
import Status from './Status'

class Requirements extends PureComponent {
  componentDidMount() {
    const { stats } = this.props
    this.setState({ form: stats })
  }

  componentWillReceiveProps(newProps) {
    const { stats, errors } = newProps
    if (!isEqual(this.props.stats, stats)) {
      this.setState({ form: stats })
    }
    if (errors !== this.props.errors) {
      this.form.setErrors(errors)
    }
  }

  render() {
    const {
      review,
      approveRequirement,
      rejectRequirement,
      loading,
      driver,
      stats,
      showDialog
    } = this.props
    return (
      <Wrapper>
        <Row>
          <Title>Compliance Verified</Title>
          <StatusWrapper>
            <Status status={ stats && stats.complianceVerified } />
            <Link onClick={ this.showComplianceView }>View documents</Link>
          </StatusWrapper>
        </Row>
        { loading ? <Loader color="#FDB924" />
          : (
            <Fragment>
              <ReviewItem
                title="Language Check"
                onApprove={ approveRequirement }
                onReject={ rejectRequirement }
                requirementType="language"
                field="languageCheck"
                review={ review.language }
                driver={ driver }
                showDialog={ showDialog }
              />
              <ReviewItem
                title="Training Completed"
                onApprove={ approveRequirement }
                onReject={ rejectRequirement }
                requirementType="training"
                field="trainingCompleted"
                review={ review.training }
                driver={ driver }
                showDialog={ showDialog }
              />
              <ReviewItem
                title="Attitude and Competence"
                onApprove={ approveRequirement }
                onReject={ rejectRequirement }
                requirementType="attitude_competence"
                field="attitudeCompetence"
                review={ review['attitude_competence'] }
                driver={ driver }
                showDialog={ showDialog }
              />
              <AdditionalRequirmetns>
                <PaleTitle>Additional requirements</PaleTitle>
                <Line />
              </AdditionalRequirmetns>
              <ReviewItem
                title="Vehicle Check"
                onApprove={ approveRequirement }
                onReject={ rejectRequirement }
                requirementType="vehicle"
                field="vehicleCheck"
                review={ review.vehicle }
                driver={ driver }
                showDialog={ showDialog }
              />
              <PhoneAndContractForm
                { ...bindState(this) } onRequestSave={ this.updatePhoneContract }
                checked={ stats.gettPhone }
              />
            </Fragment>
          )
        }
      </Wrapper>
    )
  }

  updatePhoneContract = (properties) => {
    const { updatePhoneContract, driver: { id } } = this.props
    updatePhoneContract({ properties, userId: id })
  }

  showComplianceView = () => {
    const { showComplianceView, history, driver: { id } } = this.props

    showComplianceView({ userId: id, history })
  }
}

const Wrapper = styled.div`
  flex: 3;
  height: 90vh;
  background-color: #ffffff;
  margin: 20px 0;
  padding: 30px 20px;
`

const Title = styled.div`
  flex: 1;
  margin-right: 20px;
  color: #353a47;
  font-weight: bold;
`

const AdditionalRequirmetns = styled.div`
  display: flex;
  align-items: center;
  margin: 30px 0 10px;
`

const PaleTitle = styled.div`
  flex: 1;
  margin-right: 20px;
  font-size: 18px;
  color: #8794a0;
`

const Line = styled.div`
  flex: 2;
  height: 1px;
  background: #d8d8d8;
`

const Row = styled.div`
  display: flex;
  padding: 20px 0;
  border-bottom: 1px solid #d8d8d8;
`

const StatusWrapper = styled.div`
  flex: 2;
  display: flex;
`

const Link = styled.div`
  color: #f9c13d;
  font-size: 16px;
  text-decoration: underline;
  cursor: pointer;
`

export default Requirements

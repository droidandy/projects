import React, { Component } from 'react'
import { find, isEmpty, isEqual } from 'lodash'
import { decamelizeKeys } from 'humps'
import styled from 'styled-components'

import { bindState } from 'components/form'

import VehicleDetailsForm from './VehicleDetailsForm'
import { Document } from '../Document'

class List extends Component {
  state = {}
  documents = {}

  componentWillReceiveProps(nextProps) {
    const { scrollTo, documents, kinds, vehicle } = nextProps
    if (!isEqual(documents, this.props.documents) || !isEqual(kinds, this.props.kinds)) {
      this.documents = {}
    }
    const element = this.documents[scrollTo]

    if (element) {
      element.scrollIntoView()
      this.props.clearScroll()
    }

    if (vehicle && vehicle !== this.state.form) {
      this.setState({ form: vehicle })
    }
  }

  pushToDocuments(node, name) {
    if (node && name && isEmpty(this.documents[name])) {
      this.documents[name] = node
    }
  }

  get vehicleId() {
    return this.props.vehicle && this.props.vehicle.id
  }

  renderDocuments() {
    const { documents, kinds, userId, approveDocument, rejectDocument } = this.props
    return kinds && kinds.map(kind => {
      const document = find(documents, document => document.kind.slug === kind.slug)
      const data = { ...document, ...kind }
      if (document) {
        Object.assign(data, { documentId: document.id, metadata: decamelizeKeys(document.metadata) })
      }
      const name = data.kind && data.kind.slug
      return (
        <div
          key={ `documents_${data.id}` }
          ref={ node => this.pushToDocuments(node, name) }
        >
          <Document
            data={ data }
            approveDocument={ approveDocument }
            rejectDocument={ rejectDocument }
            userId={ userId }
            vehicleId={ this.vehicleId }
          />
        </div>
      )
    })
  }

  render() {
    const { title } = this.props
    return (
      <Wrapper>
        <Title>{ title }</Title>
        { this.vehicleId &&
          <VehicleDetailsForm
            { ...bindState(this) }
            onRequestSave={ this.updateVehicleDetails }
          />
        }
        { this.renderDocuments() }
      </Wrapper>
    )
  }

  updateVehicleDetails = ({ model }) => {
    const { updateVehicleDetails, userId } = this.props

    updateVehicleDetails({ model, userId, vehicleId: this.vehicleId })
  }
}

const Wrapper = styled.div`
  margin-bottom: 45px;
`

const Title = styled.div`
  margin-bottom: 25px;
  font-size: 20px;
  font-weight: 500;
`

export default List

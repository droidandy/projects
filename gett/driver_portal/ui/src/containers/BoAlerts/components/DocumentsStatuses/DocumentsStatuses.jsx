import React, { Component } from 'react'
import { filter, map, isEqual, find } from 'lodash'
import { getStatusIcon } from '../../utils'
import styled from 'styled-components'

class DocumentsStatuses extends Component {
  state = {
    driverDocuments: [],
    vehiclesDocuments: [],
    optionalDocuments: []
  }

  componentWillMount() {
    const { driverKinds, vehiclesKinds } = this.props
    this.dataFiltering(driverKinds, vehiclesKinds)
  }

  componentWillReceiveProps(nextProps) {
    const { driverKinds, vehiclesKinds } = this.props
    if (!isEqual(driverKinds, nextProps.driverKinds) || !isEqual(vehiclesKinds, nextProps.vehiclesKinds)) {
      this.dataFiltering(nextProps.driverKinds, nextProps.vehiclesKinds)
    }
  }

  dataFiltering(driver, vehicles) {
    const driverDocuments = filter(driver, 'mandatory')
    const vehiclesDocuments = filter(vehicles, 'mandatory')
    const optionalDocuments = filter([...driver, ...vehicles], ['mandatory', false])
    this.setState({
      driverDocuments,
      vehiclesDocuments,
      optionalDocuments
    })
  }

  findStatus(data, key) {
    const document = find(data, status => status.kind.slug === key)
    return document && document.approvalStatus
  }

  renderStatuses(data, type) {
    const { vehiclesDocuments, driverDocuments } = this.props
    let documents = []
    if (type === 'driver') {
      documents = driverDocuments
    } else if (type === 'vehicle') {
      documents = vehiclesDocuments
    } else {
      documents = [...vehiclesDocuments, ...driverDocuments]
    }
    return map(data, status => {
      const { title, id, slug } = status
      return (
        <Status onClick={ () => this.props.scrollToDocument(slug) } key={ `status_${id}` }>
          <Icon>{ getStatusIcon(this.findStatus(documents, slug)) }</Icon>
          <div>{ title }</div>
        </Status>
      )
    })
  }

  render() {
    const { driverDocuments, vehiclesDocuments, optionalDocuments } = this.state

    return (
      <Wrapper>
        <Statuses>
          <Title>Driver documents:</Title>
          { driverDocuments && this.renderStatuses(driverDocuments, 'driver') }
        </Statuses>
        <Statuses>
          <Title>Vehicle documents:</Title>
          { vehiclesDocuments && this.renderStatuses(vehiclesDocuments, 'vehicle') }
        </Statuses>
        <Statuses>
          <OptionalStatusesTitle><span>Optional:</span></OptionalStatusesTitle>
          { optionalDocuments && this.renderStatuses(optionalDocuments, 'optional') }
        </Statuses>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  flex: 1;
  height: 90vh;
  background-color: #ffffff;
  margin: 20px 0;
  padding: 30px 20px;
`

const Status = styled.div`
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
`

const Title = styled.div`
  margin-bottom: 10px;
  text-transform: uppercase;
  font-size: 10px;
  color: #a9b1ba;
`

const Icon = styled.div`
  margin-right:15px;
`

const Statuses = styled.div`
  margin-bottom: 40px;
`

const OptionalStatusesTitle = styled(Title)`
  text-transform: none;
  font-size: 14px;
  position: relative;
  z-index: 1;
  
  & > span {
    padding-right: 15px;
    background: #fff;
  }
  
  &:after {
    border-top: 1px solid #d1d1d1;
    content:"";
    margin-top: -1px; 
    position: absolute; 
    top: 50%;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    z-index: -1;
  }
`

export default DocumentsStatuses

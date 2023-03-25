import React, { Component } from 'react'
import styled from 'styled-components'
import { bindState } from 'components/form'
import { isEmpty, isEqual } from 'lodash'

import DocumentForm from './DocumentForm'
import Viewer from './Viewer'

class Document extends Component {
  state = {}

  componentDidMount() {
    const { metadata } = this.props.data

    if (metadata) {
      this.setState({ form: metadata })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { metadata } = nextProps.data

    if (!isEmpty(metadata) && !isEqual(metadata, this.props.data.metadata)) {
      this.setState({ form: metadata })
    }
  }

  render() {
    const { data } = this.props
    return (
      <Wrapper>
        <Title>
          { data.title }
        </Title>
        <DocumentWrapper>
          <Viewer { ...data } />
          <DocumentForm
            { ...bindState(this) }
            fields={ data.fields }
            documentId={ data.documentId }
            approvalStatus={ data.approvalStatus }
            lastChange={ data.lastChange }
            onRequestSave={ this.approveDocument }
            onReject={ this.rejectDocument }
            showDialog={ data.showDialog }
          />
        </DocumentWrapper>
      </Wrapper>
    )
  }

  approveDocument = (metadata) => {
    const { approveDocument, data: { documentId }, userId, vehicleId } = this.props

    approveDocument({ metadata, userId, vehicleId, documentId })
  }

  rejectDocument = (data) => {
    const { rejectDocument, data: { documentId }, userId, vehicleId } = this.props
    const { metadata, comment } = data

    rejectDocument({ metadata, comment, userId, vehicleId, documentId })
  }
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 30px;
`

const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
`

const DocumentWrapper = styled.div`
  display: flex;
  margin-top: 25px;
`

export default Document

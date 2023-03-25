import React, { Component } from 'react'
import { map } from 'lodash'

import { IconQuestion } from 'components/Icons'

import Information from './Information'
import styled from 'styled-components'
import { Document } from '../Document'

class Vehicle extends Component {
  renderDocuments(type) {
    const { documents, save, id, hideLayoutScroll, showLayoutScroll } = this.props

    if (documents[type]) {
      return map(documents[type], (doc, index) => {
        const keyId = doc.kind ? doc.kind.slug : index
        return <Document
          key={ `docsv_${keyId}` }
          document={ { ...doc } }
          save={ save }
          hideLayoutScroll={ hideLayoutScroll }
          showLayoutScroll={ showLayoutScroll }
          id={ id }
        />
      })
    }
  }

  render() {
    const { model, plateNumber, color } = this.props
    return (
      <Wrapper>
        <Information
          model={ model }
          plateNumber={ plateNumber }
          color={ color }
        />
        <Title>
          Required Documents
          <StyledQuestionIcon color="#abacbe" />
        </Title>
        <DocumentsContainer>
          { this.renderDocuments('required') }
        </DocumentsContainer>
        <Title>
          Additional documents
          <StyledQuestionIcon color="#abacbe" />
        </Title>
        <DocumentsContainer>
          { this.renderDocuments('optional') }
        </DocumentsContainer>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  padding: 35px 0;
`

const Title = styled.div`
  margin: 40px 0 20px 0;
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #8794a0;
`

const StyledQuestionIcon = styled(IconQuestion)`
  margin-left: 10px;
`

const DocumentsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export default Vehicle

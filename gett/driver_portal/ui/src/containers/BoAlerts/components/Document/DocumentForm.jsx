import React from 'react'
import styled, { css } from 'styled-components'
import { map, reduce } from 'lodash'

import { Form, bindState } from 'components/form'
import { Button } from 'components/Button'
import { IconErrorOutline, IconSuccessOutline } from 'components/Icons'

import MetadataField from './MetadataField'
import CommentDialogForm from './CommentDialogForm'

class DocumentForm extends Form {
  state = {
    dialogActive: false
  }

  componentDidMount() {
    const { lastChange } = this.props

    if (lastChange) {
      this.setState({ form: { comment: lastChange.comment } })
    }
  }

  componentWillReceiveProps(nextProps) {
    const { lastChange, showDialog } = nextProps
    const { dialogActive, form } = this.state

    if (lastChange && !form) {
      this.setState({ form: { comment: lastChange.comment } })
    }

    if (!showDialog && dialogActive) {
      this.setState({ dialogActive: false })
    }
  }

  validations() {
    return reduce(this.props.fields, (validations, field) => {
      if (field.mandatory) {
        validations[field.name] = field.type === 'bool' ? 'notUndefiend' : 'presence'
      }
      return validations
    }, {})
  }

  onReject(data) {
    this.props.onReject({ metadata: this.get(), comment: data.comment })
  }

  save = this.save.bind(this)
  onReject = this.onReject.bind(this)

  $render($) {
    const { fields, documentId, approvalStatus, lastChange } = this.props
    const { dialogActive } = this.state
    const isApproved = approvalStatus === 'approved'
    const isRejected = approvalStatus === 'rejected'
    const onReject = this.onReject

    return (
      <Wrapper>
        <ButtonApprove onClick={ this.save } approved={ isApproved } disabled={ !documentId }>
          <IconSuccessOutlineStyled color={ (!documentId || isApproved) ? '#fff' : '#6bc11a' } />
          { isApproved ? 'Approved' : 'Click to approve' }
        </ButtonApprove>
        { isApproved && lastChange && <Label>Approved by { lastChange.userName }</Label> }

        <ButtonReject onClick={ this.openDialog } rejected={ isRejected } disabled={ !documentId }>
          <IconErrorOutlineStyled color={ (!documentId || isRejected) ? '#fff' : '#f00' } />
          { isRejected ? 'Rejected' : 'Click to reject' }
        </ButtonReject>
        { isRejected && lastChange && <Label>Rejected by { lastChange.userName }</Label> }

        { isRejected && lastChange.comment &&
          <RejectionReason>
            <RejectionLabel>Rejection reason</RejectionLabel>
            <Comment>{ lastChange.comment }</Comment>
          </RejectionReason>
        }

        { map(fields, (field, i) => (
          <MetadataField
            key={ i }
            $={ $ }
            type={ field.type }
            name={ field.name }
            title={ field.label }
            disabled={ !documentId }
          />)
        )}

        <CommentDialogForm
          { ...bindState(this) }
          active={ dialogActive }
          onRequestSave={ onReject }
          onClose={ this.closeDialog }
        />
      </Wrapper>
    )
  }

  openDialog = () => {
    this.setState({ dialogActive: true })
  }

  closeDialog = () => {
    this.setState({ dialogActive: false })
  }
}

const Wrapper = styled.div`
  flex: 1;
  min-width: 180px;
  margin-left: 30px;
`

const ButtonApprove = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: transparent;
  border: solid 1px #6bc11a;
  margin-bottom: 20px;
  transition: all .3s;

  &:hover {
    background: transparent;
  }

  &[disabled]:hover {
    background: #d2dadc;
    cursor: auto;
  }

  ${props => props.approved && css`
    background: #6bc11a;
    color: #fff;
    margin-bottom: 5px;

    &:hover {
      background: #6bc11a;
    }
  `}
`

const ButtonReject = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: transparent;
  border: solid 1px #f00;
  transition: all .3s;

  &:hover {
    background: transparent;
  }

  &[disabled]:hover {
    background: #d2dadc;
    cursor: auto;
  }

  ${props => props.rejected && css`
    background: #f00;
    color: #fff;
    margin-bottom: 5px;

    &:hover {
      background: #f00;
    }
  `}
`

const Label = styled.div`
  font-size: 12px;
  color: #8794a0;
  margin-bottom: 20px;
`

const IconSuccessOutlineStyled = styled(IconSuccessOutline)`
  margin-right: 10px;
`

const IconErrorOutlineStyled = styled(IconErrorOutline)`
  margin-right: 10px;
`

const RejectionReason = styled.div`
  margin-top: 20px;
`

const RejectionLabel = styled.div`
  font-size: 10px;
  color: #a8a8b5;
  text-transform: uppercase;
  margin-bottom: 5px;
`

const Comment = styled.div`
  font-size: 12px;
`

export default DocumentForm

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Button } from 'components/Button'
import { bindState } from 'components/form'

import CommentDialogForm from '../Requirements/CommentDialogForm'

class Actions extends Component {
  static propTypes = {
    approveReview: PropTypes.func,
    rejectReview: PropTypes.func,
    stopReview: PropTypes.func,
    userId: PropTypes.number,
    showDialog: PropTypes.bool,
    review: PropTypes.array
  }

  state = {
    dialogActive: false
  }

  componentWillReceiveProps(nextProps) {
    const { showDialog } = nextProps
    const { dialogActive } = this.state

    if (!showDialog && dialogActive) {
      this.setState({ dialogActive: false })
    }
  }

  render() {
    const { dialogActive } = this.state
    return (
      <Wrapper>
        <ButtonComplete disabled={ this.disableCompleteButton } onClick={ this.approveReview }>Complete</ButtonComplete>
        <ButtonFail onClick={ this.openDialog }>Fail</ButtonFail>

        <CommentDialogForm
          { ...bindState(this) }
          active={ dialogActive }
          onRequestSave={ this.rejectReview }
          onClose={ this.closeDialog }
          field="comment"
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

  approveReview = () => {
    const { approveReview, userId, history } = this.props
    approveReview({ userId, history })
  }

  rejectReview = ({ comment }) => {
    const { rejectReview, userId, history } = this.props
    rejectReview({ comment, userId, history })
  }

  get disableCompleteButton() {
    const {
      stats: { complianceVerified },
      review: { language, training, vehicle },
      review
    } = this.props

    if (!language || !training) return true
    return !(complianceVerified &&
      language.completed &&
      training.completed &&
      review.attitude_competence.completed &&
      (!vehicle || vehicle.completed)
    )
  }
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;

  button {
    margin-left: 20px;
  }
`

const ButtonComplete = styled(Button)`
  background: #6bc11a;
  color: #fff;

  &:hover {
    background: #6bc11a;
  }
`

const ButtonFail = styled(Button)`
  background: #f00;
  color: #fff;

  &:hover {
    background: #f00;
  }
`

export default Actions

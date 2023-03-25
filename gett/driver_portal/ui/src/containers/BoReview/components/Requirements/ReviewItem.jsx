import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { bindState } from 'components/form'
import { Button } from 'components/Button'
import { IconErrorOutline, IconSuccessOutline } from 'components/Icons'
import CommentDialogForm from './CommentDialogForm'
import styled, { css } from 'styled-components'

class ReviewItem extends PureComponent {
  static propTypes = {
    review: PropTypes.object,
    requirementType: PropTypes.string,
    field: PropTypes.string,
    title: PropTypes.string,
    onApprove: PropTypes.func,
    onReject: PropTypes.func
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
    const { title, review, field } = this.props
    const { dialogActive } = this.state
    const isPassed = review && review.completed
    const isFailed = review && !review.completed

    return (
      <Wrapper>
        <Title>{ title }</Title>
        <Form>
          <ButtonWrapper>
            <LeftButton>
              <ButtonApprove onClick={ this.approve } approved={ isPassed }>
                <IconSuccessOutlineStyled color={ isPassed ? '#fff' : '#6bc11a' } />
                { isPassed ? 'Passed' : 'Click to pass' }
              </ButtonApprove>
              { isPassed && <Label>Approved by { this.reviewerName }</Label> }
            </LeftButton>

            <RightButton>
              <ButtonReject onClick={ this.openDialog } rejected={ isFailed }>
                <IconErrorOutlineStyled color={ isFailed ? '#fff' : '#f00' } />
                { isFailed ? 'Failed' : 'Click to fail' }
              </ButtonReject>
              { isFailed && <Label>Failed by { this.reviewerName }</Label> }
            </RightButton>
          </ButtonWrapper>

          { isFailed && review && review[`${field}Comment`] &&
            <RejectionReason>
              <RejectionLabel>Rejection reason</RejectionLabel>
              <Comment>{ review && review[`${field}Comment`] }</Comment>
            </RejectionReason>
          }

          <CommentDialogForm
            { ...bindState(this) }
            active={ dialogActive }
            onRequestSave={ this.reject }
            onClose={ this.closeDialog }
            field={ `${field}Comment` }
          />
        </Form>
      </Wrapper>
    )
  }

  get reviewerName() {
    const { review: { reviewer } } = this.props

    return reviewer ? `${reviewer.firstName} ${reviewer.lastName}` : ''
  }

  openDialog = () => {
    this.setState({ dialogActive: true })
  }

  closeDialog = () => {
    this.setState({ dialogActive: false })
  }

  approve = () => {
    const { onApprove, requirementType, driver: { id } } = this.props
    onApprove({ userId: id, requirementType })
  }

  reject = (attributes) => {
    const { onReject, driver: { id }, requirementType, field } = this.props

    onReject({ comment: attributes[`${field}Comment`], userId: id, requirementType })
  }
}

const Wrapper = styled.div`
  display: flex;
  padding: 20px 0;
  border-bottom: 1px solid #d8d8d8;
`

const Title = styled.div`
  flex: 1;
  margin: 10px 20px 0 0;
  color: #353a47;
  font-weight: bold;
`

const Form = styled.div`
  flex: 2;
`

const ButtonWrapper = styled.div`
  display: flex;
`

const LeftButton = styled.div`
  flex: 1;
  margin-right: 20px;
`

const RightButton = styled.div`
  flex: 1;
`

const Label = styled.div`
  font-size: 12px;
  color: #8794a0;
  margin-top: 5px;
`

const ButtonApprove = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: transparent;
  border: solid 1px #6bc11a;
  transition: all .3s;

  &:hover {
    background: transparent;
  }

  ${props => props.approved && css`
    background: #6bc11a;
    color: #fff;

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

  ${props => props.rejected && css`
    background: #f00;
    color: #fff;

    &:hover {
      background: #f00;
    }
  `}
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

export default ReviewItem

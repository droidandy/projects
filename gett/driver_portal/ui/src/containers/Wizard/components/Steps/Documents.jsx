import React, { Component } from 'react'
import styled from 'styled-components'

import { media } from 'components/Media'
import { Documents as DocumentsSettings } from 'containers/Documents'
import { Button } from 'components/Button'
import { Form, Checkbox, bindState } from 'components/form'
import { isEqual } from 'lodash'

class DocumentsForm extends Form {
  state = {
    documentsUploaded: true
  }

  save = this.save.bind(this)

  componentWillReceiveProps(newProps) {
    const { attrs } = this.props
    const { attrs: { documentsUploaded } } = newProps
    if (attrs.documentsUploaded !== documentsUploaded) {
      this.setState(state => ({
        documentsUploaded
      }))
    }
  }

  $render($) {
    return (
      <Footer>
        <AgreeCheckbox>
          <Checkbox { ...$('documentsUploaded') } />
          <SmallText>I uploaded all documents</SmallText>
        </AgreeCheckbox>
        <Submit
          onClick={ this.save }
          disabled={ !this.state.documentsUploaded }>
          Finish
        </Submit>
      </Footer>
    )
  }
}

class Documents extends Component {
  componentDidMount() {
    const { currentUser } = this.props
    this.setState({ form: currentUser })
  }

  componentWillReceiveProps(newProps) {
    const { currentUser } = newProps
    if (!isEqual(this.props.currentUser, currentUser)) {
      this.setState({ form: currentUser })
    }
  }

  render() {
    const { showLayoutScroll, hideLayoutScroll } = this.props
    return (
      <div>
        <Text>
          Please upload your documents on this page as indicated below.
          Doing so now will speed up your welcome day so you can focus on the good stuff!
        </Text>
        <DocumentsSettings
          wizard
          showLayoutScroll={ showLayoutScroll }
          hideLayoutScroll={ hideLayoutScroll }
        />
        <DocumentsForm
          onRequestSave={ this.save }
          ref={ form => this.form = form }
          { ...bindState(this) }
        />
      </div>
    )
  }

  save = (data) => {
    this.props.onRequestSave(data, 4)
  }
}

const Text = styled.div`
  width: 600px;
  text-align: center;
  margin: 0 auto;
  ${media.phoneLarge`
    width: 280px;
  `}
`

const AgreeCheckbox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  font-size: 14px;
`

const Submit = styled(Button)`
  align-self: center;
`

const SmallText = styled.div`
  margin-left: 10px;
`

const Footer = styled.div`
  padding-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export default Documents

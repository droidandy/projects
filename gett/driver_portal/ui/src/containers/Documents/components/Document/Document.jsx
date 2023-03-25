import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import moment from 'moment'
import pdfjs from 'pdfjs-dist'

import { IconSuccessOutline, IconQuestion, IconErrorOutline } from 'components/Icons'
import { DatePicker } from 'components/DatePicker'
import { Button } from 'components/Button'
import { DnD } from 'components/DnD'
import { Loader } from 'components/Loader'
import { fileName as getFileName } from 'utils/file'

import Title from './Title'
import Wrapper from './Wrapper'
import Footer from './Footer'
import Preview from './Preview'
import RejectionReason from './RejectionReason'

const DEFAULT_ZOOM = 1
const DEFAULT_ZOOM_STEP = 0.1
const MAX_FILENAME_LENGTH = 20
const IMAGE_MIMETYPES = ['bmp', 'jpg', 'jpeg', 'png', 'tiff']
const DROPPABLE_MIMETYPES = ['image/bmp', 'image/jpg', 'image/jpeg', 'image/png', 'image/tiff', 'application/pdf']

class Document extends Component {
  fileInfo = {}
  state = {
    disabled: true,
    type: false,
    file: '',
    attributes: {
      expiresAt: null,
      fileUrl: null,
      fileName: null,
      contentType: null,
      kind: {
        title: ''
      }
    },
    uploadedfile: null,
    preview: {
      active: false,
      zoom: DEFAULT_ZOOM
    },
    hidePicker: false,
    reasonDialogActive: false
  }

  componentDidMount() {
    const attr = this.attr
    attr.fileUrl && this.setState({
      type: 'preview'
    }, this.handleFile)
  }

  componentWillReceiveProps = (newProps) => {
    const { document: { id } } = newProps
    if (id && id !== this.props.document.id) {
      this.setState({ disabled: true })
    }
  }

  render() {
    const { save, id, document: { approvalStatus, expiresAt, lastChange: { comment } = {} } } = this.props
    const { hidePicker, file, type, disabled, preview: { active, zoom }, uploadedfile } = this.state
    const attr = this.attr
    const fileName = getFileName(attr.fileName || (this.fileInfo && this.fileInfo.filename), MAX_FILENAME_LENGTH)
    return (
      <Wrapper>
        <DocumentWrapper>
          <Content>
            <Title>
              { attr.kind.title }
            </Title>
            <DocumentContent drawBorder={ type }>
              { this.headerRender(approvalStatus, expiresAt, comment) }
              <DnDStyled
                upload={ this.upload }
                type={ type }
                types={ DROPPABLE_MIMETYPES }
              >
                { file ? <Image onClick={ this.preview(file) } src={ file } alt="error" /> : <Loader color="#FDB924" /> }
                { file && <ImageName>
                  <div>
                    { fileName }
                  </div>
                  <UploadLink innerRef={ node => this.file = node } type="file" accept="application/pdf,image/*" onChange={ this.edit } />
                </ImageName> }
              </DnDStyled>
            </DocumentContent>
            <Footer>
              <Label>
                Expiration date
              </Label>
              <DatePickerStyled
                disabled
                value={ attr.expiresAt ? moment.utc(attr.expiresAt) : null }
                hide={ hidePicker }
                border
              />
              <Buttons>
                <Edit
                  disabled={ !file }
                  onClick={ () => this.file && this.file.click() }>
                  Edit document
                </Edit>
                <Submit
                  disabled={ disabled }
                  onClick={ () => save({ file: uploadedfile, kind: attr.kind.slug, id }) } >
                  Submit
                </Submit>
              </Buttons>
            </Footer>
          </Content>
        </DocumentWrapper>
        { this.fileInfo && active && <Preview
          active={ active }
          zoomIn={ this.zoomIn }
          zoomOut={ this.zoomOut }
          zoom={ zoom }
          onClose={ this.closePreview }
          type={ this.fileInfo.type }
          title={ fileName }
          file={ this.fileInfo.type === 'pdf' ? uploadedfile || attr.fileUrl : file } />
        }
      </Wrapper>
    )
  }

  get attr() {
    return {
      ...this.state.attributes,
      ...this.props.document
    }
  }

  upload = (file) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      this.setState({ disabled: false, uploadedfile: file }, this.handleFile(file, new Uint8Array(reader.result)))
    }
    reader.readAsArrayBuffer(file)
  }

  edit = (e) => {
    const file = e.target.files[0]

    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      this.setState({ disabled: false, uploadedfile: file }, this.handleFile(file, new Uint8Array(reader.result)))
    }
    reader.readAsArrayBuffer(file)
  }

  handleFile = (uploadFile = null, result = null) => {
    const { preview: { active, zoom } } = this.state
    const attr = this.attr

    this.fileInfo = this.handleCheckFileType((uploadFile && uploadFile.name) || attr.fileUrl, !uploadFile && attr.contentType)
    if (this.fileInfo && this.fileInfo.type === 'pdf') {
      const pdfBase64 = result || attr.fileUrl

      const doc = pdfjs.getDocument(pdfBase64)
      doc.promise.then((pdf) => {
        pdf.getPage(1).then((page) => {
          const viewport = page.getViewport(0.5)
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.height = viewport.height
          canvas.width = viewport.width
          const renderContext = {
            canvasContext: ctx,
            viewport
          }
          page.render(renderContext).then(() => {
            ctx.globalCompositeOperation = 'destination-over'
            ctx.fillStyle = '#fff'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            this.setState({
              file: canvas.toDataURL(),
              type: 'preview',
              preview: {
                active,
                zoom
              }
            })
          })
        })
      }).catch(e => { console.error(e) })
    } else if (this.fileInfo && this.fileInfo.type === 'image') {
      if (uploadFile && uploadFile.name) {
        const reader = new FileReader()
        reader.readAsDataURL(uploadFile)
        reader.onload = () => {
          this.setState({
            file: reader.result,
            type: 'preview',
            disabled: false
          })
        }
        reader.onerror = function(error) {
          console.error('Error: ', error)
        }
      } else {
        this.setState({
          file: attr.fileUrl,
          type: 'preview'
        })
      }
    } else {
      this.setState({ type: 'fail' })
    }
  }

  handleCheckFileType = (url, contentType) => {
    if (!url) return { type: '', filename: '' }
    let format = ''
    if (contentType === 'application/pdf') format = 'pdf'
    else if (typeof contentType === 'string' && contentType.indexOf('image') !== -1) format = 'image'
    else if (!contentType) {
      const parts = url.split('.')
      format = parts[parts.length - 1]
    }
    const filename = url.substring(url.lastIndexOf('/') + 1)
    if (format === 'pdf') {
      return { type: format, filename }
    } else if (IMAGE_MIMETYPES.includes(format.toLowerCase()) || format === 'image') {
      return { type: 'image', filename }
    }
    return null
  }

  preview = (fileUrl) => (e) => {
    const { hideLayoutScroll } = this.props
    hideLayoutScroll()
    this.setState(state => ({
      ...state,
      preview: {
        ...state.preview,
        active: true
      }
    }))
  }

  closePreview = () => {
    const { showLayoutScroll } = this.props
    showLayoutScroll()
    this.setState(state => ({
      ...state,
      zoom: 1,
      preview: {
        ...state.preview,
        zoom: DEFAULT_ZOOM,
        active: false
      }
    }))
  }

  openReasonDialog = () => {
    this.setState({
      reasonDialogActive: true
    })
  }

  closeReasonDialog = () => {
    this.setState({
      reasonDialogActive: false
    })
  }

  headerRender = (status, expiresAt, comment) => {
    const expireIn = moment.duration({ from: moment(), to: expiresAt })
    if (status !== 'rejected' && expiresAt && expireIn.asDays() <= 7) {
      const headerTitle = expireIn.asDays() < 0 ? 'Expired' : `Will expire in ${expireIn.humanize()}`
      return (
        <ErrorHeader>
          <IconErrorOutline height={ 20 } width={ 20 } color="#fff" />
          <HeaderTitle>{ headerTitle }</HeaderTitle>
        </ErrorHeader>
      )
    }
    switch (status) {
      case 'rejected':
        const { reasonDialogActive } = this.state
        return <ErrorHeader onClick={ this.openReasonDialog }>
          <IconErrorOutline height={ 20 } width={ 20 } color="#fff" />
          <HeaderTitle>Rejected <b>Click to see why</b></HeaderTitle>
          <RejectionReason
            reason={ comment || 'Ask your manager for the reason' }
            active={ reasonDialogActive }
            onClose={ this.closeReasonDialog }
          />
        </ErrorHeader>
      case 'approved':
        return <SuccessHeader>
          <IconSuccessOutline height={ 20 } width={ 20 } color="#fff" />
          <HeaderTitle>Approved</HeaderTitle>
        </SuccessHeader>

      case 'pending':
        return <WarningHeader>
          <IconQuestion height={ 20 } width={ 20 } color="#000" />
          <HeaderTitle>Pending approval</HeaderTitle>
        </WarningHeader>

      default:
        return <ErrorHeader>
          <IconErrorOutline height={ 20 } width={ 20 } color="#fff" />
          <HeaderTitle>Missing</HeaderTitle>
        </ErrorHeader>
    }
  }

  zoomIn = () => {
    this.setState(state => ({
      ...state,
      preview:
      {
        ...state.preview,
        zoom: state.preview.zoom + DEFAULT_ZOOM_STEP
      }
    }))
  }

  zoomOut = () => {
    this.setState(state => ({
      ...state,
      preview:
      {
        ...state.preview,
        zoom: state.preview.zoom - DEFAULT_ZOOM_STEP
      }
    }))
  }
}

const DocumentWrapper = styled.div`
  padding: 20px;
`

const Content = styled.div`
  background-color: #ffffff;
`

const DocumentContent = styled.div`
  border-radius: 4px;
  margin-top: 20px;
  position: relative;
  cursor: pointer;
  ${props => props.drawBorder && css`border: solid 1px #a8a8b5;`}
`

const Header = styled.div`
  width: 100%;
  height: 30px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px 4px 0 0;
`

const SuccessHeader = styled(Header)`
  background-color: #6bc11a;
`

const WarningHeader = styled(Header)`
  background-color: #f6b530;
  color: #000;
`

const ErrorHeader = styled(Header)`
  background-color: #ff0000;
`

const HeaderTitle = styled.div`
  font-size: 14px;
  margin-left: 10px;
`

const DnDStyled = styled(DnD)`
  border-radius: 0 0 4px 4px;
  height: 290px;
`

const Label = styled.div`
  font-size: 10px;
  font-weight: bold;
  color: #a9b1ba;
  text-transform: uppercase;
  margin-bottom: 5px;
  align-self: flex-start;
`

const ImageName = styled.div`
  bottom: 10px;
  position: absolute;
  height: 30px;
  opacity: 0.7;
  border-radius: 4px;
  background-color: #000000;
  font-size: 14px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
`

const Image = styled.img`
  max-width: 100%;
  min-height: 100%;
  object-fit: cover;
`

const UploadLink = styled.input`
  display: none;
`

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
`

const Edit = styled(Button)`
  width: auto;
  flex: 1;
  margin-bottom: 20px;
  background-color: #fff;
  ${props => !props.disabled && css`
    border: solid 1px #f6b530;
  `}

  &:hover {
    background-color: #e1a62c;
  }
`

const Submit = styled(Button)`
  width: auto;
  flex: 1;
`

const DatePickerStyled = styled(DatePicker)`
  width: 100%;
`

export default Document

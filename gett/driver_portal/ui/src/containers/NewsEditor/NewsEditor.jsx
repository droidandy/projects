import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

import { media } from 'components/Media'
import { Button } from 'components/Button'
import { Tabs } from 'components/Tabs'
import { TextField } from 'components/TextField'
import { SelectDropdown } from 'components/SelectDropdown'
import { DatePicker } from 'components/DatePicker'
import { Loader } from 'components/Loader'
import { IconImage } from 'components/Icons'
import { NewsPreview } from 'components/NewsPreview'
import { BackOfficeLayout } from 'containers/Layouts/BackOfficeLayout'

import { TextEditor } from './components/TextEditor'
import { NewsCropper } from './components/NewsCropper'
import { mapStateToProps } from './reducers'
import * as mapDispatchToProps from './actions'

const FORMAT_DATE = 'YYYY-MM-DD'
const FORMAT_TIME = 'HH:mm:ssZ'
const DATE_FORMAT = 'DD MMMM YYYY'
const TIME_PICKER_STEP = 1800
const ITEM_TYPES = {
  'regular': 'News',
  'featured': 'Reportage',
  'numbers': 'Numbers'
}

class NewsEditor extends Component {
  state = {
    attributes: {
      title: '',
      content: '',
      publishedAt: moment(),
      itemType: 'regular',
      image: ''
    },
    imageInsert: {},
    errors: {},
    activeTab: 0,

    newsCropper: {
      active: false,
      image: null,
      croppedImage: '',
      name: null
    },

    hidePicker: false
  }

  componentDidMount() {
    this.reset(this.load(this.props))
  }

  componentWillReceiveProps(newProps) {
    const { imageInsert, news } = newProps
    if (news.id && this.isCreate) {
      if (isEmpty(news.errors)) {
        this.reset(this.props.history.replace('/bonews', true))
      }
    } else if (!isEmpty(news) && this.state.attributes !== news) {
      this.setState(state => {
        let { activeTab } = state
        if (this.isPreview && this.state.activeTab !== 1 && !this.isNumbers(news)) {
          activeTab = 1
        }
        return {
          ...state,
          attributes: { ...state.attributes, ...news },
          activeTab
        }
      })
    }
    if (this.props.imageInsert !== imageInsert) {
      this.setState({ imageInsert })
    }
  }

  render() {
    const { currentUser, logout, history: { location }, news } = this.props
    const attr = {
      ...this.props.news,
      ...this.state.attributes,
      errors: {
        ...this.props.news.errors,
        ...this.state.errors
      }
    }
    const { imageInsert, newsCropper, activeTab, hidePicker } = this.state
    const disabledEdit = news && news.published

    return (
      <BackOfficeLayout
        currentUser={ currentUser }
        logout={ logout }
        location={ location }
        onScroll={ this.handleScroll }
      >
        <Container>
          <PageHeader>
            <PageName>
              { attr.id ? 'Edit post' : 'Create new post' }
            </PageName>
            <Actions>
              <SelectDropdown
                width={ 220 }
                onChange={ this.update('itemType') }
                selected={ ITEM_TYPES[attr.itemType] }
                values={ ITEM_TYPES } />
              <ButtonStyled onClick={ this.save }>
                Save
              </ButtonStyled>
              <ButtonCancel onClick={ this.cancel }>
                Cancel
              </ButtonCancel>
            </Actions>
          </PageHeader>
          <Content>
            <Tabs delimeter active={ activeTab } onChange={ this.changeTab }>
              <div title="Creating">
                { attr.loading ? <Loader color="#FDB924" />
                  : <Fragment>
                    <Fields>
                      <Title
                        value={ attr.title }
                        onChange={ this.update('title') }
                        placeholder="Input news title here"
                      />
                      <DatePickerStyled
                        value={ moment.utc(attr.publishedAt) }
                        formatInput={ DATE_FORMAT }
                        handleSelect={ this.updateDateTime('date') }
                        changeHide={ this.changePicker }
                        disabled={ disabledEdit }
                        minDate={ moment() }
                        hide={ hidePicker }
                        border
                      />
                      <TimePicker>
                        <SelectDropdown
                          values={ this.timePickerHours(disabledEdit) }
                          onChange={ this.updateDateTime('time') }
                          disabled={ disabledEdit }
                          selected={ moment.utc(attr.publishedAt).format('HH:mm') }
                          width={ 170 }
                          nooverlay
                        />
                      </TimePicker>
                    </Fields>
                    {
                      !isEmpty(attr.errors) && attr.errors.title && <Errors>
                        <Error>{ attr.errors.title }</Error>
                      </Errors>
                    }
                    { attr.itemType === 'numbers'
                      ? <TextField
                        value={ attr.number }
                        onChange={ this.update('number') }
                        placeholder="Input number here"
                        errors={ attr.errors.number }
                      />
                      : <Fragment>
                        <UploadWrapper>
                          <Upload innerRef={ node => this.file = node } type="file" accept="image/*" onChange={ this.uploadImage } />
                          {(newsCropper.name || attr.imageName) && <UploadName>
                            <IconImageStyled color="#d8d8d8" />
                            { newsCropper.name || attr.imageName }
                          </UploadName>
                          }
                          <UploadButton onClick={ () => this.file.click() } htmlFor="file">{ attr.id ? 'Change image' : 'Upload image' }</UploadButton>
                        </UploadWrapper>
                        {
                          !isEmpty(attr.errors) && attr.errors.image && <UploadErrors>
                            <Error>{ attr.errors.image }</Error>
                          </UploadErrors>
                        }
                        <TextEditor
                          value={ attr.content }
                          onChange={ this.update('content') }
                          imageInsert={ this.imageInsert }
                          image={ imageInsert.imageUrl }
                        />
                        {
                          !isEmpty(attr.errors) && attr.errors.content && <Errors>
                            <Error>{ attr.errors.content }</Error>
                          </Errors>
                        }
                      </Fragment>
                    }
                  </Fragment>
                }
              </div>
              { !this.isNumbers(attr) && <div title="Preview">
                <Preview>
                  <NewsPreview news={ attr } image={ newsCropper } />
                </Preview>
              </div> }
            </Tabs>
          </Content>
          <NewsCropper
            active={ newsCropper.active }
            image={ newsCropper.image }
            closeNewsCropper={ this.closeNewsCropper }
            handleCrop={ this.crop }
          />
        </Container>
      </BackOfficeLayout>
    )
  }

  save = () => {
    const news = { ...this.state.attributes }
    const { imageInsert, newsCropper } = this.state
    const { saveNews, history } = this.props
    news.image = {
      name: newsCropper.name,
      image: newsCropper.croppedImage
    }
    if (imageInsert.bindingHash) news.bindingHash = imageInsert.bindingHash
    saveNews({ news, callback: () => this.reset(history.replace('/bonews', true)) })
  }

  cancel = () => {
    this.reset(this.props.history.replace('/bonews', true))
  }

  update = (field) => (val) => {
    this.setState(state => ({
      ...state,
      attributes: { ...state.attributes, [field]: val },
      errors: { ...state.errors, [field]: [] }
    }))
  }

  updateDateTime = (type) => (e) => {
    if (e) {
      const val = (e.target && e.target.value) || e
      this.setState(state => {
        const { publishedAt } = state.attributes
        let dateTime = moment()
        let hidePicker = false
        if (type === 'date') {
          hidePicker = true
          dateTime = moment(val).format(FORMAT_DATE) + 'T' + moment.utc(publishedAt).format(FORMAT_TIME)
        } else if (type === 'time') {
          dateTime = moment.utc(publishedAt).format(FORMAT_DATE) + 'T' + moment.utc(val, 'HH:mm').format(FORMAT_TIME)
        }
        return {
          ...state,
          attributes: { ...state.attributes, publishedAt: dateTime },
          errors: { ...state.errors, publishedAt: [] },
          hidePicker
        }
      })
    }
  }

  uploadImage = (e) => {
    const reader = new FileReader()
    const image = e.target.files[0]

    if (!image) return

    reader.onloadend = (img) => {
      return this.handleFileChange(img.target.result, image.name)
    }

    reader.readAsDataURL(image)
    // fix to allow to select the same file
    e.target.value = null
  }

  load = (props) => {
    const { match } = props
    if (match && match.params && match.params.id && match.params.id !== 'create') {
      this.props.loadNews({ id: match.params.id })
    }
  }

  reset = (callback) => {
    this.setState({
      attributes: {
        title: '',
        content: '',
        publishedAt: moment(),
        itemType: 'regular',
        image: ''
      },
      errors: {},
      imageInsert: {},
      newsCropper: {
        active: false,
        image: null,
        croppedImage: '',
        name: null,
        nameWas: null
      },
      hidePicker: false
    }, callback)
    this.props.resetNews()
  }

  timePickerHours(disabled) {
    let time = []
    const { publishedAt } = this.state.attributes
    const currentSeconds = moment.utc(0).add(moment().format('HH') * 3600, 's')
    // 86400 - number of seconds in a day
    for (let i = 0; i < 86400; i = i + TIME_PICKER_STEP) {
      const pushTime = moment.utc(0).add(i, 's').format('HH:mm')
      if (disabled) {
        time.push(pushTime)
      } else if (moment.utc(0).add(i, 's').isAfter(currentSeconds)) {
        time.push(pushTime)
      } else if (moment.utc(publishedAt).startOf('day').isAfter(moment.utc().startOf('day'))) {
        time.push(pushTime)
      }
    }
    return time
  }

  changeTab = (activeTab) => {
    this.setState({ activeTab })
  }

  imageInsert = () => {
    const fileInput = document.createElement('input')
    fileInput.setAttribute('type', 'file')
    fileInput.click()
    fileInput.onchange = (e) => {
      const reader = new FileReader()
      const image = e.target.files[0]

      reader.onloadend = () => {
        const { imageInsert, attributes } = this.state
        const toSend = {}
        toSend.bindingHash = imageInsert.bindingHash
        if (attributes.id) toSend.newsId = attributes.id
        this.props.uploadImage({
          image,
          ...toSend
        })
      }

      reader.readAsDataURL(image)
    }
  }

  handleFileChange = (dataURI, name) => {
    this.setState(state => ({
      newsCropper: {
        ...state.newsCropper,
        image: dataURI,
        active: true,
        name
      }
    }))
  }

  crop = (dataURI) => {
    this.setState(state => ({
      ...state,
      newsCropper: {
        ...state.newsCropper,
        active: false,
        image: null,
        croppedImage: dataURI,
        nameWas: state.newsCropper.name
      }
    }))
  }

  closeNewsCropper = () => {
    this.setState(state => ({
      ...state,
      newsCropper: {
        ...state.newsCropper,
        active: false,
        name: state.newsCropper.nameWas
      }
    }))
  }

  changePicker = () => {
    this.setState({ hidePicker: false })
  }

  get isPreview() {
    const { match } = this.props
    if (match && match.path && match.path.indexOf('preview') !== -1) {
      return true
    }
    return false
  }

  get isCreate() {
    const { match } = this.props
    if (match && match.path && match.path.indexOf('create') !== -1) {
      return true
    }
    return false
  }

  isNumbers = (news) => {
    return news && news.itemType === 'numbers'
  }
}

const Container = styled.div`
  position: relative;
  background-color: #f4f7fa;
  padding-bottom: 70px;
  min-height: 100%;
  height: 100%;

  ${media.phoneLarge`
    padding: 15px;
  `}
`

const Content = styled.div`
  background-color: #fff;
  margin: 30px 30px 0 30px;
  padding: 30px 30px 30px 30px;
`

const PageHeader = styled.div`
  display: flex;
  height: 48px;
  align-items: center;
  justify-content: space-between;
  margin: 20px 30px 0 0;

  ${media.phoneLarge`
    margin-right: 15px;
  `}
`

const PageName = styled.span`
  font-size: 36px;
  color: #303030;
  margin-left: 30px;
`

const ButtonStyled = styled(Button)`
  width: 100px;
  margin-left: 10px;

  ${media.phoneLarge`
    width: 60px;
  `}
`

const ButtonCancel = styled(ButtonStyled)`
  background-color: #fff;

  &:hover {
    background-color: #e1a62c;
  }
`

const Fields = styled.div`
  display: flex;
`

const Title = styled(TextField)`
  flex: 2;
`

const DatePickerStyled = styled(DatePicker)`
  display: flex;
  align-items: center;
  margin: 0 20px 0 20px;
`

const TimePicker = styled.div`
  display:flex;
  align-items: center;
`

const Actions = styled.div`
  display: flex;
`

const UploadWrapper = styled.div`
  display: flex;
  margin: 30px 0 30px 0;
  align-items: center;
`

const Upload = styled.input`
  display: none;
`

const UploadName = styled.div`
  display: flex;
  justify-content: center;
  margin-right: 30px;
`

const IconImageStyled = styled(IconImage)`
  margin-right: 10px;
`

const UploadButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 140px;
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: solid 1px #f6b530;
  cursor: pointer;

  &:hover {
    background-color: #f6b530;
  }
`

const Preview = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Errors = styled.div`
  margin-top: 5px;
`

const UploadErrors = styled(Errors)`
  margin: -20px 0 10px 0;
`

const Error = styled.div`
  font-size: 12px;
  text-align: left;
  color: #ff0000;
`

export default connect(mapStateToProps, mapDispatchToProps)(NewsEditor)

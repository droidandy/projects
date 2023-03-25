import React from 'react'
import { Form, TextField, PhoneField, SelectDropdown, DatePicker, AddressAutocomplete } from 'components/form'
import { Button } from 'components/Button'
import { Avatar } from 'components/Avatar'
import { Loader } from 'components/Loader'
import { disabilityTypes } from './data'
import styled from 'styled-components'
import { media } from 'components/Media'
import { fileName } from 'utils/file'

import { AvatarCropper } from './AvatarCropper'
import { ConfirmationDialog } from './ConfirmationDialog'

class EditApolloProfileForm extends Form {
  state = {
    confirmationActive: false,
    avatarCropper: {
      active: false,
      image: null,
      avatarUrl: '',
      name: null
    }
  }

  validations = {
    lastName: ['presence', 'personName'],
    firstName: ['presence', 'personName'],
    email: ['presence', 'email'],
    phone: ['presence', 'phone'],
    birthDate: 'isInPast',
    drivingCabSince: 'isInPast',
    address: 'presence',
    sortCode: 'presence',
    accountNumber: 'presence',
    password: (value) => {
      if (this.bankAccountInfoChanged && this.state.confirmationActive) {
        return Form.validations.presence(value)
      }
    }
  }

  save = this.save.bind(this)

  trySave = () => {
    if (this.bankAccountInfoChanged) {
      this.ifValid(this.openConfirmation)
    } else {
      this.save()
    }
  }

  changeBankAccountInfo(attr, value) {
    this.bankAccountInfoChanged = true
    this.set(attr, value)
  }

  changeAddress(value, geo) {
    const nextAttrs = { address: value, city: '', postcode: '' }

    if (geo) {
      const { city, postalCode: postcode } = geo
      Object.assign(nextAttrs, { city, postcode })
    }

    this.set(nextAttrs)
  }

  $render($) {
    const { confirmationActive, avatarCropper } = this.state
    const { attrs, loading, avatar } = this.props

    return (
      <div>
        <PageHeader>
          <PageName>Profile edit</PageName>
          { loading
            ? <LoaderStyled color="#FDB924" />
            : <ButtonStyled onClick={ this.trySave }>Save</ButtonStyled>
          }
        </PageHeader>
        <Container>
          <Content>
            <Title>Driver Information</Title>
            <Wrapper>
              <Details>
                <Row>
                  <LeftColumn>
                    <TextFieldStyled { ...$('firstName') } label="First name" placeholder="Start typing" />
                  </LeftColumn>
                  <Column>
                    <TextFieldStyled { ...$('lastName') } label="Last name" placeholder="Start typing" />
                  </Column>
                </Row>
                <Row>
                  <LeftColumn>
                    <TextFieldStyled { ...$('insuranceNumber') } label="NINO" placeholder="Start typing" disabled={ !localStorage.getItem('adminToken') } />
                  </LeftColumn>
                  <Column>
                    <TextFieldStyled { ...$('licenseNumber') } label="TFL" placeholder="Start typing" disabled />
                  </Column>
                </Row>
                <Row>
                  <LeftColumn>
                    <TextFieldStyled { ...$('email') } type="email" label="Email" placeholder="Start typing" />
                  </LeftColumn>
                  <Column>
                    <PhoneFieldStyled { ...$('phone') } label="Phone" placeholder="Start typing" />
                  </Column>
                </Row>
                <Row>
                  <LeftColumn>
                    <TextFieldStyled { ...$('gettId') } disabled label="Gett Id" />
                  </LeftColumn>
                  <Column>
                    <Label>Date of birth</Label>
                    <DatePicker { ...$('birthDate') } border />
                  </Column>
                </Row>
                <Row>
                  <LeftColumn>
                    <TextFieldStyled { ...$('city') } disabled label="City of residence" />
                  </LeftColumn>
                  <Column>
                    <TextFieldStyled { ...$('postcode') } disabled label="Postcode" />
                  </Column>
                </Row>
                <Label>Home address</Label>
                <AddressAutocomplete { ...$('address')(this.changeAddress) } />
                <Row>
                  <LeftColumn>
                    <TextFieldStyled { ...$('hobbies') } label="My interests & hobbies" placeholder="Start typing" />
                    <Label>Driving a cab since</Label>
                    <DatePicker { ...$('drivingCabSince') } border />
                  </LeftColumn>
                  <Column>
                    <TextFieldStyled { ...$('talkingTopics') } label="I like to talk about" placeholder="Start typing" />
                    <Label>Please, know that I am</Label>
                    <SelectDropdown { ...$('disabilityType') } values={ disabilityTypes } includeBlank />
                  </Column>
                </Row>
              </Details>
              <AvatarWrapper>
                <Upload innerRef={ node => this.file = node } type="file" accept="image/*" onChange={ this.uploadImage } />
                <AvatarStyled user={ avatarCropper.avatarUrl ? { avatarUrl: avatarCropper.avatarUrl } : attrs } width={ 280 } height={ 280 } />
                {
                  (avatarCropper.name || attrs.avatarFilename) && <UploadName>
                    { fileName(avatarCropper.name || attrs.avatarFilename, 20) }
                  </UploadName>
                }
                { localStorage.getItem('adminToken') && <ChangeDocuments onClick={ () => this.file.click() } htmlFor="file">Change Image</ChangeDocuments> }
              </AvatarWrapper>
            </Wrapper>
          </Content>
          <Content>
            <Title>Bank Account information</Title>
            <Row>
              <Details>
                <Row>
                  <LeftColumn>
                    <TextFieldStyled { ...$('sortCode')(this.changeBankAccountInfo, 'sortCode') } label="Sort code" placeholder="Start typing" />
                  </LeftColumn>
                  <Column>
                    <TextFieldStyled { ...$('accountNumber')(this.changeBankAccountInfo, 'accountNumber') } label="Account number" placeholder="Start typing" />
                  </Column>
                </Row>
              </Details>
            </Row>
          </Content>
          <AvatarCropper
            active={ avatarCropper.active }
            image={ avatarCropper.image }
            closeAvatarCropper={ this.closeAvatarCropper }
            handleCrop={ this.crop }
            loading={ avatar.loading }
          />
          <ConfirmationDialog
            $={ $ }
            active={ confirmationActive }
            onConfirm={ this.save }
            onClose={ this.closeConfirmation }
            loading={ loading }
          />
        </Container>
      </div>
    )
  }

  openConfirmation = () => {
    this.setState({
      confirmationActive: true
    })
  }

  closeConfirmation = () => {
    this.setState({
      confirmationActive: false
    }, () => this.set('password', ''))
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

  handleFileChange = (dataURI, name) => {
    this.setState(state => ({
      avatarCropper: {
        ...state.avatarCropper,
        image: dataURI,
        active: true,
        name
      }
    }))
  }

  crop = (dataURI) => {
    this.setState(state => ({
      ...state,
      avatarCropper: {
        ...state.avatarCropper,
        active: false,
        image: null,
        avatarUrl: dataURI,
        nameWas: state.avatarCropper.name
      }
    }), () => this.props.updateAvatar({ dataURI, name: this.state.avatarCropper.name }))
  }

  closeAvatarCropper = () => {
    this.setState(state => ({
      ...state,
      avatarCropper: {
        ...state.avatarCropper,
        active: false,
        name: state.avatarCropper.nameWas
      }
    }))
  }
}

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  background: #f4f7fa;
  padding: 30px;

  ${media.phoneLarge`
    padding: 15px;
  `}
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

  ${media.phoneLarge`
    font-size: 22px;
  `}
`

const Content = styled.div`
  background: #fff;
  padding: 20px 25px;
  margin-bottom: 20px;
  border-radius: 4px;
`

const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #000;
`

const ButtonStyled = styled(Button)`
  width: 120px;
`

const ChangeDocuments = styled(Button)`
  height: 30px;
  background-color: #fff;
  border: solid 1px #f6b530;
  margin-top: 20px;

  &:disabled {
    border-color: #d2dadc;
  }
`

// Upload avatar
const Upload = styled.input`
  display: none;
`

const UploadName = styled.div`
  display: flex;
  justify-content: center;
  font-size: 14px;
  color: #74818f;
`

const Row = styled.div`
  display: flex;
  align-items: start;

  ${media.phoneMedium`
    flex-direction: column;
  `}
`

const Wrapper = styled.div`
  display: flex;
  align-items: start;

  ${media.phoneLarge`
    flex-direction: column-reverse;
  `}
`

const Details = styled.div`
  width: 60%;

  ${media.phoneLarge`
    width: 100%;
  `}
`
const AvatarWrapper = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${media.phoneLarge`
    width: 100%;
  `}
`

const Column = styled.div`
  width: 50%;

  ${media.phoneMedium`
    width: 100%;
  `}
`

const LeftColumn = styled(Column)`
  margin-right: 50px;

  ${media.desktopSmall`
    margin-right: 40px;
  `}

  ${media.phoneMedium`
    margin-right: 0;
  `}
`

const Label = styled.div`
  width: 100%;
  height: 13px;
  font-size: 10px;
  font-weight: bold;
  text-align: left;
  color: #a9b1ba;
  margin: 30px 0 5px;
  text-transform: uppercase;
`

const TextFieldStyled = styled(TextField)`
  margin: 30px 0 0;
`

const PhoneFieldStyled = styled(PhoneField)`
  margin: 30px 0 0;
`

const AvatarStyled = styled(Avatar)`
  margin: 40px 0 20px;

  ${media.desktopSmall`
    width: 220px;
    height: 220px;
  `}

  ${media.phoneLarge`
    width: 175px;
    height: 175px;
  `}

  ${media.phoneMedium`
    width: 130px;
    height: 130px;
  `}
`

const LoaderStyled = styled(Loader)`
  margin: 0;
`

export default EditApolloProfileForm

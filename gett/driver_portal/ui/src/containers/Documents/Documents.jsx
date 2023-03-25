import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { map, flatMap, filter } from 'lodash'

import { IconQuestion } from 'components/Icons'
import { Button } from 'components/Button'
import { Tabs } from 'components/Tabs'
import { media } from 'components/Media'

import { Vehicle } from './components/Vehicle'
import { Accordion, Section } from './components/Accordion'
import { Document } from './components/Document'
import { EditVehicleDialog } from './components/EditVehicleDialog'

import * as mapDispatchToProps from './actions'
import { mapStateToProps } from './reducers'

class Documents extends Component {
  state = {
    activeTab: 0,
    dialog: {
      active: false
    }
  }

  componentDidMount() {
    this.props.loadDocuments()
    this.props.loadVehicles()
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeTab } = this.state
    if (prevState.activeTab !== activeTab) {
      switch (activeTab) {
        case 1:
          this.props.loadVehicles()
          break
        default:
          this.props.loadDocuments()
          break
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dialog: { active } } = this.state
    if (!nextProps.show && active) {
      this.setState(state => ({
        ...state,
        dialog: {
          active: false
        }
      }))
    }
  }

  renderVehiles() {
    const { vehicles, saveVehicle, wizard, hideLayoutScroll, showLayoutScroll } = this.props
    return map(vehicles, (car, index) => {
      const expireDocumentsNumber = filter(car.documents.required, doc => doc.expirationWarning).length

      return (
        <Section
          vehiclesCount={ vehicles.length }
          wizard={ wizard }
          open={ wizard && index === 0 }
          title={ car.title }
          key={ `Vehicle_${car.id}` }
          removeVehicle={ this.removeVehicle(car) }
          renameVehicle={ this.renameVehicle(car) }
          setAsCurrentVehicle={ this.setAsCurrentVehicle(car) }
          expireDocumentsNumber={ expireDocumentsNumber }
        >
          <Vehicle
            save={ saveVehicle }
            hideLayoutScroll={ hideLayoutScroll }
            showLayoutScroll={ showLayoutScroll }
            documents={ car.documents }
            model={ car.model }
            color={ car.color }
            plateNumber={ car.plateNumber }
            id={ car.id }
          />
        </Section>
      )
    })
  }

  renderDocuments(type) {
    const { documents, saveDocument, hideLayoutScroll, showLayoutScroll } = this.props
    if (documents[type]) {
      return map(documents[type], (doc, index) => {
        const keyId = doc.kind ? doc.kind.slug : index
        return <Document
          key={ `docs_${keyId}` }
          save={ saveDocument }
          document={ { ...doc } }
          hideLayoutScroll={ hideLayoutScroll }
          showLayoutScroll={ showLayoutScroll }
        />
      })
    }
  }

  render() {
    const { update, create, updateVehicle, createVehicle, title, documents, vehicles } = this.props
    const { activeTab, dialog } = this.state
    const driverDocumentsWarning = filter(documents.required, doc => doc.expirationWarning).length > 0
    const vehicleDocumentsWarning = flatMap(vehicles, car => filter(car.documents.required, doc => doc.expirationWarning)).length > 0

    return (
      <Wrapper>
        <PageHeader>
          { title && <PageName> { title } </PageName> }
          { activeTab === 1 && <CreateButton onClick={ this.create }>Add new vehicle</CreateButton> }
        </PageHeader>
        <Container>
          <Tabs delimeter active={ activeTab } onChange={ this.changeTab }>
            <Tab title="Driver Documents" alerticon={ driverDocumentsWarning }>
              <Title>
                Required Documents
                <StyledQuestionIcon color="#abacbe" />
              </Title>
              <DocumentsContainer>
                { this.renderDocuments('required') }
              </DocumentsContainer>
              {/* <Title>
                Additional documents
                <StyledQuestionIcon color="#abacbe" />
              </Title> */}
              <DocumentsContainer>
                { this.renderDocuments('optional') }
              </DocumentsContainer>
            </Tab>
            <Tab title="Vehicle Documents" alerticon={ vehicleDocumentsWarning }>
              <Accordion>
                { this.renderVehiles() }
              </Accordion>
              <EditVehicleDialog
                width={ 420 }
                active={ dialog.active }
                vehicle={ dialog.vehicle }
                data={ dialog.type === 'edit' ? update : create }
                saveVehicle={ dialog.type === 'edit' ? updateVehicle : createVehicle }
                onClose={ this.closeDialog }
              />
            </Tab>
          </Tabs>
        </Container>
      </Wrapper>
    )
  }

  changeTab = (activeTab) => {
    this.setState({ activeTab })
  }

  removeVehicle = (vehicle) => () => {
    this.props.removeVehicle({ vehicle })
  }

  setAsCurrentVehicle = (vehicle) => () => {
    this.props.setVehicle(vehicle)
  }

  closeDialog = () => {
    this.setState(state => ({
      ...state,
      dialog: {
        active: false
      }
    }))
  }

  renameVehicle = (vehicle) => () => {
    this.setState(state => ({
      ...state,
      dialog: {
        active: true,
        type: 'edit',
        vehicle
      }
    }))
  }

  create = () => {
    this.setState(state => ({
      ...state,
      dialog: {
        active: true,
        type: 'create'
      }
    }))
  }
}

const PageHeader = styled.div`
  display: flex;
  height: 48px;
  align-items: center;
  margin-top: 20px;
  justify-content: space-between;
`
const PageName = styled.span`
  font-size: 36px;
  color: #303030;
  margin-left: 30px;
  ${media.phoneLarge`
    font-size: 22px;
    margin-left: 15px;
  `}
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const CreateButton = styled(Button)`
  margin-right: 30px;
  margin-left: auto;

  ${media.phoneLarge`
    margin-right: 15px;
  `}
`

const Tab = styled.div`
  padding-bottom: 40px;
`

const Container = styled.div`
  position: relative;
  width: 100%;
  padding:0 30px;
  margin-top: 30px;
  background: #f4f4f4;

  ${media.phoneMedium`
    padding: 0;
  `}
`

const StyledQuestionIcon = styled(IconQuestion)`
  margin-left: 10px;
`

const DocumentsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Title = styled.div`
  margin: 40px 0 20px 0;
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #8794a0;
`
export default connect(mapStateToProps, mapDispatchToProps)(Documents)

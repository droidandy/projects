import React, { Component } from 'react'
import styled from 'styled-components'
import { media } from 'components/Media'
import { BackOfficeLayout } from 'containers/Layouts/BackOfficeLayout'
import { isEmpty, isEqual, debounce, map, pick } from 'lodash'
import { connect } from 'react-redux'
import { Empty } from 'components/Empty'
import { Header } from './components/Header'
import { Bottom } from './components/Bottom'
import { UserDialog } from './components/UserDialog'
import { Active, Inactive, Frozen } from 'components/Status'
import { GridActions } from './components/GridActions'
import * as mapDispatchToProps from './actions'
import { mapStateToProps } from './reducers'
import {
  Grid,
  GridHeader,
  GridHeaders,
  ScrollableBody,
  GridRow,
  GridColumn,
  Dots
} from 'components/Grid'
import { roleNameToLabel } from './utils/rolesToLabel'

class Users extends Component {
  state = {
    page: 1,
    perPage: 20,
    query: '',
    dialog: {
      active: false
    }
  }

  componentWillMount() {
    this.props.initialize()
  }

  componentDidMount() {
    this.loadUsers()
  }

  componentDidUpdate(prevProps, prevState) {
    const importantFields = [ 'page', 'perPage', 'query' ]

    const dirty = !isEqual(
      pick(prevState, importantFields),
      pick(this.state, importantFields)
    )

    if (dirty) {
      this.loadUsers()
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

  render() {
    const { query, page, perPage, dialog } = this.state
    const {
      currentUser, logout, loading, total,
      users, update, history: { location },
      updateUser, createUser, create
    } = this.props
    return (
      <BackOfficeLayout
        currentUser={ currentUser }
        logout={ logout }
        location={ location }
      >
        <Container>
          <Header
            loading={ loading }
            query={ query }
            onSearch={ this.search }
            create={ this.create }
          />
          <Content>
            {
              isEmpty(users) ? (
                <Empty loading={ loading } />
              ) : (
                <Grid>
                  <GridHeaders>
                    <GridHeader>First Name</GridHeader>
                    <GridHeader>Last Name</GridHeader>
                    <GridHeader flex={ 2 }>Email</GridHeader>
                    <GridHeader flex={ 2 }>Role</GridHeader>
                    <GridHeader flex={ 0.5 }>Status</GridHeader>
                    <GridHeader flex={ 0.5 } />
                  </GridHeaders>
                  <ScrollableBody>
                    {
                      map(users, user => (
                        <GridRow key={ user.id }>
                          <GridColumn>{ user.firstName }</GridColumn>
                          <GridColumn>{ user.lastName }</GridColumn>
                          <GridColumn flex={ 2 }>{ user.email }</GridColumn>
                          <GridColumn flex={ 2 }>{ roleNameToLabel(user.roles[0]) }</GridColumn>
                          <GridColumn flex={ 0.5 }>
                            <StatusLabelsHolder>
                              { user.active ? (
                                <Active>Active</Active>
                              ) : (
                                <Inactive>Inactive</Inactive>
                              )}
                              { user.isFrozen && <FrozenLabel>Frozen</FrozenLabel> }
                            </StatusLabelsHolder>
                          </GridColumn>
                          <GridColumn flex={ 0.5 }>
                            <GridActions
                              trigger={ <Dots /> }
                              user={ user }
                              onActivate={ this.activate }
                              onDeactivate={ this.deactivate }
                              onInvite={ this.invite }
                              onReInvite={ this.reInvite }
                              onEdit={ this.edit }
                            />
                          </GridColumn>
                        </GridRow>
                      ))
                    }
                  </ScrollableBody>
                </Grid>
              )
            }
          </Content>
          <Bottom
            page={ page }
            perPage={ perPage }
            total={ total }
            onChange={ this.paginate }
          />
          <UserDialog
            width={ 700 }
            active={ dialog.active }
            user={ dialog.user }
            data={ dialog.type === 'edit' ? update : create }
            action={ dialog.type === 'edit' ? updateUser : createUser }
            onClose={ this.closeDialog }
          />
        </Container>
      </BackOfficeLayout>
    )
  }

  loadUsers = debounce(() => {
    const { query, page, perPage } = this.state
    this.props.loadUsers({ query, page, perPage })
  }, 300)

  fullName = () => {
    const { firstName, lastName } = this.props.currentUser
    return `${firstName} ${lastName}`
  }

  activate = (user) => {
    this.props.activateUser({ user })
  }

  invite = (user) => {
    this.props.inviteUser({ user })
  }

  reInvite = (user) => {
    this.props.inviteUser({ user })
  }

  edit = (user) => {
    this.setState(state => ({
      ...state,
      dialog: {
        active: true,
        type: 'edit',
        user
      }
    }))
  }

  closeDialog = () => {
    this.setState(state => ({
      ...state,
      dialog: {
        active: false
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

  deactivate = (user) => {
    this.props.deactivateUser({ user })
  }

  search = (query) => {
    this.setState({ query })
  }

  paginate = ({ page, perPage }) => {
    this.setState({ page: page || 1, perPage: perPage || this.state.perPage })
  }
}

const Container = styled.div`
  position: relative;
  background-color: #f4f7fa;
  padding-bottom: 70px;
  min-height: 100%;
  height: 100%;
`

const Content = styled.div`
  padding: 30px 30px 30px;
  width: 100%;
  height: 100%;
  background-color: #f4f7fa;

  ${media.phoneLarge`
    padding: 0px;
    overflow: visible;
  `}
`

const StatusLabelsHolder = styled.div`
  display: flex;
`

const FrozenLabel = styled(Frozen)`
  margin-left: 10px;
`

export default connect(mapStateToProps, mapDispatchToProps)(Users)

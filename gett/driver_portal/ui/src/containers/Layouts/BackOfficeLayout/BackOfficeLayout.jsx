import React, { PureComponent } from 'react'
import { NavLink, Link } from 'react-router-dom'
import styled from 'styled-components'
import { map, intersection, isEmpty } from 'lodash'
import { Tablet, DesktopTablet, PhoneSmall } from 'components/MediaQuery'
import { media } from 'components/Media'
import { Menu } from 'components/Menu'
import { LogoWhite } from 'components/Logo'
import { IconStatistics, IconDrivers, IconNews, IconUsers, IconAssignment, IconHub } from 'components/Icons'
import { Logout } from 'components/Logout'
import { hasRoles } from 'components/hocs/authorize'
import { ConfirmationDialog } from 'components/ConfirmationDialog'

class BackOfficeLayout extends PureComponent {
  state = {
    isOpen: false,
    showDialog: false
  }

  handleMenuOverlay = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  renderMenuData(data, isOpen) {
    const { currentUser, location } = this.props

    if (currentUser.loading || !currentUser.authenticated) {
      return null
    }

    if (hasRoles(currentUser, 'driver')) {
      return null
    }

    return map(data, (menu, key) => {
      const Icon = menu.icon
      return (
        <MenuItem
          key={ key }
          to={ menu.url }
          activeStyle={ { backgroundColor: '#3D414B', color: '#fff' } }
          isopen={ (isOpen || this.state.isOpen).toString() }
        >
          <Icon
            color={ location && location.pathname.includes(menu.url) ? '#f6b530' : '#74818d' }
          />
          <ItemText>
            { menu.name }
          </ItemText>
        </MenuItem>
      )
    })
  }

  onLogout = () => {
    this.props.logout()
  }

  logout = () => {
    const { currentUser: { agentStatus, assignedDriversCount } } = this.props
    if (agentStatus === 'in_progress' || assignedDriversCount) {
      this.setState({ showDialog: true })
    } else {
      this.onLogout()
    }
  }

  onClose = () => {
    this.setState({ showDialog: false })
  }

  handleLogout = () => {
    this.logout()
  }

  get userName() {
    const { currentUser } = this.props

    if (currentUser.loading || !currentUser.authenticated) {
      return null
    }

    return `${currentUser.firstName} ${currentUser.lastName}`
  }

  renderMenu(data, showBurger, isOpen, width, height) {
    return (
      <MenuStyled
        width={ 270 }
        handleMenuOverlay={ this.handleMenuOverlay }
        logo={ <GettLogoInMenu width={ width } height={ height } /> }
        logoText={ <LogoText isOpen={ isOpen || this.state.isOpen }>Driver Portal</LogoText> }
        showBurger={ showBurger }
        isOpen={ isOpen }
      >
        { this.renderMenuData(data, isOpen) }
      </MenuStyled>
    )
  }

  get menuList() {
    const { currentUser: { roles } } = this.props
    const data = [
      {
        name: 'Drivers',
        url: '/drivers',
        icon: IconDrivers,
        roles: ['site_admin', 'system_admin', 'driver_support', 'compliance_agent']
      },
      {
        name: 'Users',
        url: '/bousers',
        icon: IconUsers,
        roles: ['site_admin']
      },
      {
        name: 'Statistics',
        url: '/bostatistics',
        icon: IconStatistics,
        roles: ['site_admin']
      },
      {
        name: 'News',
        url: '/bonews',
        icon: IconNews,
        roles: ['site_admin', 'community_manager']
      },
      {
        name: 'Alerts',
        url: '/boalerts',
        icon: IconNews,
        roles: ['site_admin', 'compliance_agent']
      },
      {
        name: 'Assignment',
        url: '/boassignment',
        icon: IconAssignment,
        roles: ['site_admin', 'onboarding_agent']
      },
      {
        name: 'Onboarding Hub',
        url: '/specialisthub',
        icon: IconHub,
        roles: ['site_admin', 'onboarding_agent']
      }
    ]
    return map(data, item => {
      if (!isEmpty(intersection(item.roles, roles))) return item
    }).filter(Boolean)
  }

  render() {
    const { currentUser, onScroll } = this.props
    const { isOpen } = this.state

    const Cont = <Top>
      <ProfileContainer>
        <ProfileInfo>
          { this.userName }
        </ProfileInfo>
        {
          !currentUser.loading && currentUser.authenticated && <Logout
            onClick={ this.handleLogout }
          />
        }
      </ProfileContainer>
      { hasRoles(currentUser, 'onboarding_agent') &&
        (
          <ConfirmationDialog
            active={ this.state.showDialog }
            onClose={ this.onClose }
            onConfirm={ this.onLogout }
          >
            <div>
              Are you sure? All assigned drivers to you will be unassigned
            </div>
          </ConfirmationDialog>
        )
      }
    </Top>

    return (
      <Page onScroll={ onScroll }>
        <DesktopTablet>
          {this.renderMenu(this.menuList, false, true, 127, 85)}
        </DesktopTablet>
        <Tablet>
          {this.renderMenu(this.menuList, true, false, 127, 85)}
        </Tablet>
        <PhoneSmall>
          {this.renderMenu(this.menuList, true, false)}
        </PhoneSmall>
        <Content isOpen={ isOpen }>
          {Cont}
          <ChidlrenWrap>
            {this.props.children}
          </ChidlrenWrap>
        </Content>
      </Page>
    )
  }
}

const GettLogoInMenu = ({ width, height }) => (
  <Link to="/">
    <LogoWhiteStyled width={ width || 90 } height={ height || 60 } />
  </Link>
)

const Page = styled.div`
  margin: 0;
  height: 100%;
  display: flex;
  overflow: ${props => props.isOpen ? 'hidden' : 'auto'};
`

const MenuStyled = styled(Menu)`
  background-color: #282c37;
`

const MenuItem = styled(NavLink)`
  font-family: Roboto;
  font-size: 16px;
  text-align: left;
  color: #74818f;

  padding-left: 32px;
  height: 46px;
  display: flex;
  align-items: center;
  cursor: pointer;

  text-decoration: none;

  &:hover {
    background-color: #3D414B;
    color: #fff;
  }

  transform: ${props => props.isopen === 'true' ? '0' : 'translate3d(-270px, 0, 0)'};
  transition: transform ${props => props.isopen === 'true' ? '1s' : '1.5s'} ease-in-out;
`

const Content = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  background: #f4f7fa;

  transform: ${props => props.isOpen ? 'translate3d(270px, 0, 0)' : '0'};
  z-index:: ${props => props.isOpen ? '0' : '1'};
  transition: transform 1s ease-in-out;

  ${media.tablet`margin-left: -50px;`}
`

const ChidlrenWrap = styled.div`
  margin-left: 270px;
  height: calc(100% - 85px);

  ${media.tablet`margin-left: 0`}
`

const LogoWhiteStyled = styled(LogoWhite)`
  margin-top: 15px;
  display: flex;
  justify-content: center;
`

const ItemText = styled.div`
  margin-left: 22px;
`

const LogoText = styled.div`
  margin: 0 auto;
  margin-top: 5px;
  height: 26px;
  font-family: Roboto;
  font-size: 20px;
  letter-spacing: 1px;
  color: #ffffff;
  text-align: center;
  margin-bottom: 80px;

  ${media.phoneSmall`margin-bottom: 35px;`}

  transform: ${props => props.isOpen ? '0' : 'translate3d(-270px, 0, 0)'};
  transition: transform ${props => props.isOpen ? '1s' : '1.5s'} ease-in-out;
`

const Top = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 60px;
  width: 100%;
  background-color: #fff;
  margin-bottom: 25px;
`

const ProfileContainer = styled.div`
  display:flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
`

const ProfileInfo = styled.div`
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  color: #000000;

  margin-left: 20px;
  margin-right: 30px;
`

export default BackOfficeLayout

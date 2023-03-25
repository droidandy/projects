import React, { PureComponent } from 'react'
import { NavLink, Link } from 'react-router-dom'
import styled from 'styled-components'
import { map, filter } from 'lodash'
import { Tablet, DesktopTablet, PhoneSmall } from 'components/MediaQuery'
import { media, sizes } from 'components/Media'
import { Menu } from 'components/Menu'
import { Avatar } from 'components/Avatar'
import { LogoWhite } from 'components/Logo'
import { IconStatistics, IconStatements, IconProfile, IconNews, IconDocuments, IconOnboarding, IconInformation } from 'components/Icons'
import { Logout } from 'components/Logout'
import { hasRoles } from 'components/hocs/authorize'

import { SocialLinks } from './SocialLinks'
import { StaticPagesMenu } from './StaticPagesMenu'
import { CurrentVehicle } from './CurrentVehicle'

class FrontOfficeLayout extends PureComponent {
  state = {
    isOpen: false
  }

  handleMenuOverlay = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  renderMenuData(data, isOpen) {
    const { currentUser, location } = this.props

    if (currentUser.loading || !currentUser.authenticated) {
      return null
    }

    if (hasRoles(currentUser, 'site_admin')) {
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
            color={ location.pathname.includes(menu.url) ? '#f6b530' : '#74818d' }
          />
          <ItemText>
            { menu.name }
          </ItemText>
          { menu.alertIcon && <IconInformationStyled color="#f00" /> }
        </MenuItem>
      )
    })
  }

  handleLogout = () => {
    this.props.logout()
    window.location = '/auth'
  }

  get userName() {
    const { currentUser } = this.props

    if (currentUser.loading || !currentUser.authenticated) {
      return null
    }

    return `${currentUser.firstName} ${currentUser.lastName}`
  }

  renderMenu(data, showBurger, isOpen, width, height) {
    const { currentUser, setVehicle } = this.props
    return (
      <MenuStyled
        width={ 270 }
        handleMenuOverlay={ this.handleMenuOverlay }
        logo={ <GettLogoInMenu width={ width } height={ height } /> }
        logoText={ <LogoText isOpen={ isOpen || this.state.isOpen }>Driver Portal</LogoText> }
        currentVehicle={ currentUser.onboardingCompleted &&
          <VehicleDropdown
            isOpen={ isOpen || this.state.isOpen }
            setVehicle={ setVehicle }
            vehicles={ filter(currentUser.vehicles, vehicle => vehicle.approvalStatus === 'approved') }
          />
        }
        avatarInfo={
          <AvatarWrapper>
            <Avatar
              width={ 40 }
              height={ 40 }
              user={ currentUser }
            />
            <ProfileInfo color="#ffffff" >
              { this.userName }
            </ProfileInfo>
          </AvatarWrapper>
        }
        showBurger={ showBurger }
        isOpen={ isOpen }
        role={ currentUser.roles[0] }
      >
        { this.renderMenuData(data, isOpen) }
        <PhoneSmall maxWidth={ sizes.tablet }>
          <StaticPagesMenu
            isOpen={ isOpen || this.state.isOpen }
            showContactUs={ !currentUser.loading && currentUser.authenticated }
            showTerms={ currentUser.onboardingCompleted || currentUser.roles[0] === 'driver' }
          />
        </PhoneSmall>
        <Bottom>
          { (currentUser.onboardingCompleted || currentUser.roles[0] === 'driver') && <SocialLinks isOpen={ isOpen || this.state.isOpen } /> }
        </Bottom>
      </MenuStyled>
    )
  }

  getMenuList() {
    const { currentUser: { onboardingCompleted, roles, documentsExpirationWarning } } = this.props
    const role = roles[0]

    const rolesData = [
      {
        name: 'Profile',
        url: role === 'apollo_driver' ? '/profile' : '/profilecab',
        icon: IconProfile
      }
    ]

    if (role === 'apollo_driver') {
      rolesData.push({
        name: 'Documents',
        url: '/documents',
        icon: IconDocuments,
        alertIcon: documentsExpirationWarning
      })
    }

    const data = [
      {
        name: 'Earnings',
        url: '/earnings',
        icon: IconStatistics
      },
      {
        name: 'Statements',
        url: '/statements',
        icon: IconStatements
      },
      ...rolesData,
      {
        name: 'News',
        url: '/news',
        icon: IconNews
      }
    ]

    const onboardingData = [
      {
        name: 'Onboarding',
        url: '/wizard/',
        icon: IconOnboarding
      }
    ]

    if (role === 'driver') {
      return data
    } else if (role === 'apollo_driver') {
      return onboardingCompleted ? data : onboardingData
    }
  }

  render() {
    const { currentUser, onScroll } = this.props
    const { isOpen } = this.state
    const activeStyle = { color: '#000', borderBottom: '3px solid #eeaf2e', paddingBottom: '18px' }
    const list = this.getMenuList()

    const Cont = <Top>
      <ProfileContainer>
        <DesktopTablet>
          {
            (currentUser.onboardingCompleted || currentUser.roles[0] === 'driver') &&
            <TopMenuLink activeStyle={ activeStyle } to="/auth/terms">
              Terms & Conditions
            </TopMenuLink>
          }
          <TopMenuLink activeStyle={ activeStyle } to="/auth/privacy">
            Privacy Policy
          </TopMenuLink>
          {
            !currentUser.loading && currentUser.authenticated &&
            <TopMenuLink activeStyle={ activeStyle } to="/auth/contact">
              Contact Us
            </TopMenuLink>
          }
          <TopMenuLink activeStyle={ activeStyle } to="/auth/faq">
            FAQs
          </TopMenuLink>
        </DesktopTablet>
        <AvatarInfo
          width={ 40 }
          height={ 40 }
          user={ currentUser } />
        <ProfileInfo>
          { this.userName }
        </ProfileInfo>
        {
          !currentUser.loading && currentUser.authenticated && <Logout
            onClick={ this.handleLogout }
          />
        }
      </ProfileContainer>
    </Top>

    return (
      <Page onScroll={ onScroll }>
        <DesktopTablet>
          {this.renderMenu(list, false, true, 127, 85)}
        </DesktopTablet>
        <Tablet>
          {this.renderMenu(list, true, false, 127, 85)}
        </Tablet>
        <PhoneSmall>
          {this.renderMenu(list, true, false)}
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
  -webkit-overflow-scrolling: touch;
`

const MenuStyled = styled(Menu)`
  background-color: #282c37;
`

const MenuItem = styled(NavLink)`
  font-family: Roboto;
  font-size: 14px;
  text-align: left;
  color: #74818f;

  padding-left: 32px;
  height: 40px;
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
  background: #f4f4f4;

  transform: ${props => props.isOpen ? 'translate3d(270px, 0, 0)' : '0'};
  z-index:: ${props => props.isOpen ? '0' : '1'};
  transition: transform 1s ease-in-out;

  ${media.tablet`margin-left: -50px;`}
`

const ChidlrenWrap = styled.div`
  margin-left: 270px;

  ${media.tablet`margin-left: 0`}
`

const LogoWhiteStyled = styled(LogoWhite)`
  margin-top: 15px;
  display: flex;
  justify-content: center;
`

const ItemText = styled.div`
  flex: 1;
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
  margin-bottom: 70px;

  ${media.phoneLarge`margin-bottom: 35px;`}

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
`

const TopMenuLink = styled(NavLink)`
  font-family: Roboto;
  font-size: 14px;
  color: #6e7a87;

  text-decoration: none;
  margin-left: 60px;
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
  color: ${props => props.color ? props.color : '#000000'};

  margin-left: 20px;
  margin-right: 30px;
`

const AvatarInfo = styled(Avatar)`
  margin-left: 60px;
`

const Bottom = styled.div`
  position: fixed;
  bottom: 20px;
  left: 0;

  ${media.phoneLarge`
    position: static;
    margin-top: auto;
    margin-bottom: 20px;
    bottom: auto;
    left: auto;
  `}
`

const AvatarWrapper = styled.div`
  padding: 40px 0 30px 32px;
  display: flex;
  align-items: center;
`

const VehicleDropdown = styled(CurrentVehicle)`
  transform: ${props => props.isOpen ? '0' : 'translate3d(-270px, 0, 0)'};
  transition: transform ${props => props.isOpen ? '1s' : '1.5s'} ease-in-out;
`

const IconInformationStyled = styled(IconInformation)`
  transform: rotate(180deg);
  margin-right: 20px;
`

export default FrontOfficeLayout

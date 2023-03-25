import React, { Component, Fragment } from 'react'
import { DesktopTablet, PhoneLarge } from 'components/MediaQuery'
import styled from 'styled-components'

import { BurgerIcon, CrossIcon } from './components'

class Menu extends Component {
  state = {
    isOpen: false
  };

  toggleMenu = () => {
    this.setState({ isOpen: !this.state.isOpen }, this.props.handleMenuOverlay())
  }

  get isDriver() {
    const { role } = this.props
    return role === 'driver' || role === 'apollo_driver'
  }

  renderLogo() {
    const { logo, logoText } = this.props
    return (
      <Fragment>
        { logo }
        { logoText }
      </Fragment>
    )
  }

  renderAvatar() {
    const { avatarInfo } = this.props
    return (
      <AvatarWrapper>
        { avatarInfo }
      </AvatarWrapper>
    )
  }

  render() {
    const { children, className, showBurger, currentVehicle } = this.props
    let { isOpen } = this.state
    if (this.props.isOpen) isOpen = true
    return (
      <MenuContainer isOpen={ isOpen }>
        <MenuOverlay
          onClick={ this.toggleMenu }
          isOpen={ isOpen && showBurger }
        />
        <MenuWrap className={ className } isOpen={ isOpen } showBurger={ showBurger }>
          <Holder>
            <FlexWrapper>
              <DesktopTablet>
                { this.renderLogo() }
              </DesktopTablet>
              <PhoneLarge>
                { this.isDriver ? this.renderAvatar() : this.renderLogo() }
              </PhoneLarge>
              { this.isDriver && <CurrentVehicle>{ currentVehicle }</CurrentVehicle> }
              { children }
            </FlexWrapper>
          </Holder>
          {isOpen && showBurger && <CrossIconStyled
            onClick={ this.toggleMenu }
          />
          }
        </MenuWrap>
        {showBurger && <BurgerIconStyled
          onClick={ this.toggleMenu }
        />}
      </MenuContainer>
    )
  }
}

const MenuContainer = styled.div`
  z-index: 1;
  height: ${props => props.isOpen ? 100 : 10}%;
`

const Holder = styled.div`
  overflow-y: auto;
  height: 100%;
`

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`

const MenuWrap = styled.div`
  position: fixed;
  right: inherit;
  z-index: 2;
  height: 100%;
  width: ${props => props.isOpen ? `${props.width || '270'}px` : '0px'};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: ${props => props.isOpen ? 'visibility 0.3s, width 1s ease-in-out' : 'visibility 0.9s, width 1s ease-in-out'};
  
  background ${props => props.backgroundColor || '#282c37;'};
  display: flex;
  flex-direction: column;
`

const MenuOverlay = styled.div`
  position: fixed;
  z-index: 1;
  width: ${props => props.isOpen ? '100%' : '0%'};
  height: 100%;
  backdrop-filter: blur(2px);
  background-color: #ffffff;
  
  opacity: ${props => props.isOpen ? 0.4 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: visibility 0s, opacity 0.5s linear; width 1s ease-in-out;
`

const BurgerIconStyled = styled(BurgerIcon)`
  border: none;
  background: transparent;
  outline: none;
  
  color: #303030;
  display: flex;
  align-items: center;
  height: 60px;
  margin-left: 31px;
  cursor: pointer;
`

const CrossIconStyled = styled(CrossIcon)`
  position: absolute;
  width: 15px;
  height: 15px;
  top: 15px;
  right: -30px;
  cursor: pointer;
`

const CurrentVehicle = styled.div`
  padding: 0 30px 0 32px;
  margin-bottom: 30px;
`

const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
`

export default Menu

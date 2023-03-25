import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import { IconBigArrow, IconInformation } from 'components/Icons'
import { Actions } from '../Actions'
import { Dots } from 'components/Grid'

export default class Section extends Component {
  state = {
    opened: false,
    maxHeight: 0
  }

  componentDidMount() {
    const { open } = this.props
    this.setState({
      maxHeight: this.content.children[0].clientHeight,
      opened: open && this.state.opened !== open
    })
  }

  onSelect = () => {
    this.setState(state => ({ opened: !state.opened }))
  }

  render() {
    const { title, children, removeVehicle, renameVehicle, setAsCurrentVehicle, wizard, vehiclesCount, expireDocumentsNumber } = this.props
    const { opened, maxHeight } = this.state
    return (
      <Wrapper opened={ opened }>
        <Header>
          <Title>{ title }</Title>
          { !!expireDocumentsNumber &&
            <Alert>
              <IconInformationStyled width={ 30 } height={ 30 } color="#f00" />
              <AlertText>{ expireDocumentsNumber } document(s) needs updating</AlertText>
            </Alert>
          }
          <IconHolder onClick={ this.onSelect }>
            { opened
              ? <OffArrow />
              : <OnArrow />
            }
          </IconHolder>
          <ActionsHolder>
            <IconHolder>
              <Actions
                trigger={ <Dots /> }
                item={ title }
                wizard={ wizard }
                onRemove={ removeVehicle }
                onRename={ renameVehicle }
                onSetAsCurrent={ setAsCurrentVehicle }
                vehiclesCount={ vehiclesCount }
                nooverlay
              />
            </IconHolder>
          </ActionsHolder>
        </Header>
        <Content maxHeight={ maxHeight } innerRef={ content => this.content = content } active={ opened }>
          { children }
        </Content>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  ${props => !props.opened && css`border-bottom: 1px solid #d2dadc;`};
  padding: 30px 0;
  margin-bottom: 20px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
`

const IconHolder = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  text-align: center;
  width: 40px;
  height: 40px;
  margin-left: auto;
  border-radius: 50%;
  background: #fff;
`

const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
`

const ActionsHolder = styled.div`
  margin-left: 10px;
`

const OffArrow = styled(IconBigArrow)`
  transform: rotate(180deg);
`

const OnArrow = styled(IconBigArrow)`
  transform: rotate(0deg);
`

const Content = styled.div`
  max-height: 0;
  transition: max-height 0.3s linear;
  overflow: hidden;
  font-size: 14px;

  ${props => props.active && `max-height: ${props.maxHeight}px`};
`

const Alert = styled.div`
  display: flex;
  align-items: center;
  margin-left: 30px;
`

const AlertText = styled.div`
  color: #000;
`

const IconInformationStyled = styled(IconInformation)`
  transform: rotate(180deg);
  margin-right: 10px;
`

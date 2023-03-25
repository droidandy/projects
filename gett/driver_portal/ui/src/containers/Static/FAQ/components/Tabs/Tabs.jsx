import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MediaQuery from 'react-responsive'
import { media, sizes } from 'components/Media'
import styled from 'styled-components'

export default class Tabs extends Component {
  static propTypes = {
    orientation: PropTypes.string
  }

  static defaultProps = {
    orientation: 'horizontal'
  }

  state = {
    activeTabIndex: 0
  }

  componentDidMount() {
    this.setActiveTabIndex()
  }

  componentWillReceiveProps() {
    this.setActiveTabIndex()
  }

  getActiveTabIndex() {
    const queryUrl = new URLSearchParams(window.location.search)
    return queryUrl.get('tab') ? +queryUrl.get('tab') : null
  }

  setActiveTabIndex() {
    this.setState({ activeTabIndex: this.getActiveTabIndex() })
  }

  renderNavigationsLinks() {
    return React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        tabIndex: index + 1,
        isActive: this.state.activeTabIndex === index + 1
      })
    })
  }

  renderContent() {
    const { children } = this.props
    const { activeTabIndex } = this.state
    if (children[activeTabIndex - 1]) {
      return children[activeTabIndex - 1].props.children
    }
  }

  render() {
    const { orientation } = this.props
    return (
      <TabsWrapper orientation={ orientation }>
        <MediaQuery minWidth={ sizes.phoneLarge }>
          <TabsNavigation orientation={ orientation } >
            { this.renderNavigationsLinks() }
          </TabsNavigation>
        </MediaQuery>
        <MediaQuery maxWidth={ sizes.phoneLarge } >
          { this.state.activeTabIndex === null &&
            <TabsNavigation orientation={ orientation } >
              { this.renderNavigationsLinks() }
            </TabsNavigation>
          }
        </MediaQuery>
        <TabsContentContainer>
          { this.renderContent() }
        </TabsContentContainer>
      </TabsWrapper>
    )
  }
}

const TabsWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  border-radius: 4px;
  ${props => props.orientation === 'horizontal' ? 'flex-direction: column' : 'flex-direction: row'};
  ${media.phoneLarge`flex-direction: column;`}
`
const TabsNavigation = styled.ul`
  display: flex;
  flex: 1;
  list-style-type: none;
  margin: 0;
  padding: 30px;
  background: #fff;
  color: #000000;
  font-size: 16px;
  font-weight: bold;
  ${props => props.orientation === 'horizontal' ? 'flex-direction: row' : 'flex-direction: column'};
  ${media.phoneLarge`width: 100%; flex-direction: column;`}
`
const TabsContentContainer = styled.div`
  margin-left: 50px;
  ${media.phoneLarge`margin-left: 0;`}
  border-radius: 4px;
  flex: 2;
`

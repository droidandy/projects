import React from 'react'
import { Glyphicon, Nav, NavItem } from 'react-bootstrap'
import _ from 'lodash'

export default class Tabs extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render(){
    let currentTab = this.props.currentTab
    let onSelect = this.props.onSelect
    let grid = this.props.grid
    let numberOfTabs = this.props.numberOfTabs
    let _onClick = this.props._onClick
    return(
      <Nav bsStyle="tabs" activeKey={currentTab} onSelect={onSelect}>
          {_.map(grid, (tab, i) =>
          <NavItem 
            eventKey={tab.tabKey} 
            key={i}>{tab.tabName + " "}
            <a href="#" onClick={this.props._handleRemoveTab.bind(this,i)}>
              <Glyphicon glyph="remove"/>
            </a>
          </NavItem>
          )}
          { numberOfTabs < 10 &&
          <NavItem onClick={_onClick}>
              <Glyphicon glyph="plus" /> Add dashboard
          </NavItem>
          }
      </Nav>
    )
  }
}


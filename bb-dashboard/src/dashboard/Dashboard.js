import React, { Component } from 'react'
import './Dashboard.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import * as request from "request-promise-native"
import SubReddit from './Reddit.js'
import Tweets from './Tweets'
import Gnews from './Gnews'
import Graph from './Graph'
import Navbar from './Navbar'
import AddForm from './AddForm'
import AddTab from './AddTab'
import Coin from './Coin'
import _ from 'lodash'
import randomId from './helper'
import { Glyphicon } from 'react-bootstrap'
import News from './News Aggregator/News'
import Tabs from './Tabs'

var WidthProvider = require('react-grid-layout').WidthProvider;
var ReactGridLayout = require('react-grid-layout');
ReactGridLayout = WidthProvider(ReactGridLayout);

const GRID_SIZE = 12
const WIDGET_WIDTH = 4

export default class Dashboard extends Component {

  constructor() {
    super();

    this.state = {
      showModal: false,
      showModalTab: false,
      grid: {
        // tabKey: { tabKey, tabName, tabType, grid:
        //   [
        //     {key:"100", id:100, x:0, width:4, type:"gnews", crypto:"bitcoin"},
        //     {key:"102", id:102, x:4, y:0, width:4, h: 15, type:"tweets", crypto:"bitcoin"}
        //     {key:"999", id:999, x:4, width:4, type:"coin", crypto:"bitcoin"}
        //   ]
        // }
      },
      currentTab: null,
      layouts: [],
      profile: null
    };
  }

  componentWillMount() {
    this._restoreWidgets()
  }
  
  render() {
    const { currentTab, grid, layouts, showModal, showModalTab } = this.state
    const numberOfTabs = Object.keys(grid).length

    return(
      <div className="things-box">
        <Navbar _handleOpenModal={this._handleOpenModal.bind(this)}
          auth={this.props.auth}/>
        <AddForm
          showModal={showModal}
          closeHandler={this._handleCloseModal.bind(this)}
          addHandler={this._addWidget.bind(this)}
        />
        <AddTab
          showModal={showModalTab}
          closeHandler={this._handleCloseModalTab}
          addHandler={this._addDashboard}
        />
        <Tabs 
          currentTab={currentTab} 
          onSelect={this._handleSelectTabs} 
          grid={grid}
          numberOfTabs={numberOfTabs}
          _onClick={this._handleOpenModalTab}
          _handleRemoveTab={this._handleRemoveTab}
        />
        { numberOfTabs > 0 &&
          <nav className="navbar navbar">
            <div className="container-fluid">
              <ul className="nav navbar-nav">
                <li>
                  <a href="#" onClick={this._handleOpenModal.bind(this)}>
                    <Glyphicon glyph="plus" /> Add a widget
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        }
        <div className="content">
          <ReactGridLayout
            className="layout"
            cols={12} rowHeight={30}
            verticalCompact={true}
            autoSize={true}
            draggableHandle=".handle"
            layout={layouts}
            onLayoutChange={this._layoutChange}>
            { grid[currentTab] && this._getWidgets() }
          </ReactGridLayout>
        </div>
      </div>
    );
  }

  _addWidget(options){
    const { grid, currentTab } = this.state
    const widget = {
      type: options.type,
      crypto: options.crypto,
      key: randomId(),
      x: (grid[currentTab].grid.length * WIDGET_WIDTH) % GRID_SIZE,
      width: options.width,
      y: 0,
      h: options.h
    }
    let newGrid = _.cloneDeep(grid)
    newGrid[currentTab].grid = newGrid[currentTab].grid.concat(widget)
    this._saveGridState(newGrid)
  }

  _addDashboard = tab => {
    this._addTab(tab.name, tab.type, tab.crypto)
  }
  
  _addTab = (name, type, crypto, grid = []) => {
    if (type === 'coin') {
      grid = [
        {
          type: "coin",
          crypto,
          key: randomId(),
          x: 0,
          width: 2,
          y: 0,
          h: 7
        },
        {
          type: "graph",
          crypto: "bitcoin",
          key: randomId(),
          x: 4,
          width: 8,
          y: 0,
          h: 15
        },
        {
          type: "tweets",
          crypto,
          key: randomId(),
          x: 0,
          width: 4,
          y: 8,
          h: 7
        },
        {
          type: "reddit",
          crypto,
          key: randomId(),
          x: 4,
          width: 4,
          y: 15,
          h: 15
        },
        {
          type: "gnews",
          crypto,
          key: randomId(),
          x: 8,
          width: 4,
          y: 15,
          h: 15
        },
        {
          type: "coin",
          crypto,
          key: randomId(),
          x: 2,
          width: 2,
          y: 0,
          h: 7
        }
      ]
    }
    const newTab = {
      tabKey: randomId(),
      tabName: name,
      tabType: type,
      grid
    }
    const newGrid = {
      ...this.state.grid,
      [newTab.tabKey]: newTab
    }
    this.setState({currentTab: newTab.tabKey}, () => {
      this._saveGridState(newGrid)
    })
  }

  _getWidgets(){
    return this.state.grid[this.state.currentTab].grid.map(widgetConfig => {
      let widget
      switch (widgetConfig.type) {
        case "reddit":
          widget = <SubReddit
            title={widgetConfig.type}
            key={randomId()}
            id={widgetConfig.key}
            crypto={widgetConfig.crypto}
            _handleRemoveWidget={this._handleRemoveWidget}/>
          break;
        case "tweets":
          widget = <Tweets
            title={widgetConfig.type}
            key={widgetConfig.key}
            id={widgetConfig.key}
            crypto={widgetConfig.crypto}
            _handleRemoveWidget={this._handleRemoveWidget}/>
          break;
        case "gnews":
          widget = <Gnews
            title={widgetConfig.type}
            key={widgetConfig.key}
            id={widgetConfig.key}
            crypto={widgetConfig.crypto}
            _handleRemoveWidget={this._handleRemoveWidget}/>
          break;
        case "graph":
          widget = <Graph
            title={widgetConfig.type}
            key={widgetConfig.key}
            id={widgetConfig.key}
            crypto={widgetConfig.crypto}
            _handleRemoveWidget={this._handleRemoveWidget}/>
          break;
        case "coin":
          widget = <Coin
            title={widgetConfig.type}
            key={widgetConfig.key}
            id={widgetConfig.key}
            crypto={widgetConfig.crypto}
            _handleRemoveWidget={this._handleRemoveWidget}/>
          break;
          case "anews":
          widget = <News
            title={widgetConfig.type}
            key={widgetConfig.key}
            id={widgetConfig.key}
            crypto={widgetConfig.crypto} 
            _handleRemoveWidget={this._handleRemoveWidget}/>
          break;             

        default:
          break;
      }
      return (
        <div key={widgetConfig.key} 
        data-grid={{
          x: widgetConfig.x, 
          y: widgetConfig.y, 
          w: parseInt(widgetConfig.width, 0), 
          h: parseInt(widgetConfig.h, 0),
          maxH: parseInt(widgetConfig.h, 0)
        }} >
          {widget}
        </div>
      );
    })
  }

  _handleOpenModal() {
    this.setState({ showModal: true });
  }
  
  _handleCloseModal (e) {
    this.setState({ showModal: false });
  }

  _handleOpenModalTab = () => {
    this.setState({ showModalTab: true });
  }

  _handleCloseModalTab = () => {
    this.setState({ showModalTab: false });
  }

  _handleRemoveWidget = key => {
    const { currentTab } = this.state
    let newTabs = _.cloneDeep(this.state.grid)
    const newGrid = _.reject(newTabs[currentTab].grid, function(widget){
      return widget.key === key
    })
    newTabs[currentTab].grid = newGrid
    this._saveGridState(newTabs)
  }

  _handleRemoveTab = key => {
    console.log(key)
    const { currentTab } = this.state
    let newGrid = _.cloneDeep(this.state.grid)
    console.log(newGrid)
    delete newGrid[key]
    console.log(newGrid)
    this._saveGridState(newGrid)
  }

  _handleSelectTabs = tab => {
    if(tab) {
      this.setState({currentTab: tab}, () => this._saveGridState(this.state.grid))
    }
  }

  _layoutChange = layouts => {
    const { grid, currentTab } = this.state
    let newTabs = _.cloneDeep(grid)
    if(newTabs[currentTab]) {
      const newGrid = _.cloneDeep(newTabs[currentTab].grid)
      layouts.forEach(layout => {
        let currentGrid = newGrid.find(gridElement => gridElement.key === Number(layout.i))
        if (currentGrid) {
          currentGrid.width = layout.w
          currentGrid.x = layout.x
          currentGrid.y = layout.y
          currentGrid.h = layout.h
        }
      })
      newTabs[currentTab].grid = newGrid
      this._saveGridState(newTabs)
    }
  }

  _generateLayout = grid => {
    const layouts =  _.map(grid, (item, i) => ({
      x: item.x,
      y: item.y,
      w: item.width,
      h: item.h,
      i: item.key.toString(),
      static: false,
    }))
    this.setState({layouts})
  }

  _restoreWidgets = () => {
    const {getProfile} = this.props.auth;

    getProfile((profile) => {
      this.setState({ profile })
      const gridObject = this.state.profile.user_metadata.grid
      let grid = gridObject.table
      if(!grid) {
        grid = {}
      }
      let currentTab = gridObject.currentTab
      if(!currentTab) {
        currentTab = null
      }
      // if (gridObject[currentTab] == undefined){
      //   currentTab = Object.keys(gridObject)[0]
      // }
      const localGrid = JSON.parse(localStorage.getItem('current_grid'))
      if (localGrid) {
        const local_updated_at = localGrid.timestamp
        if (!gridObject.timestamp || new Date(local_updated_at) > new Date(gridObject.timestamp)) {
          grid = localGrid.table
          currentTab = localGrid.currentTab
        }
      }
      if (grid[currentTab]) {
        this._generateLayout(grid[currentTab].grid)
        this.setState({ grid, currentTab })
      } else if (grid.length > 0){
        this._addTab('Custom', 'custom', '', grid)
      }
    })
  }

  _saveGridState(grid_state){
    let { currentTab } = this.state

    this.setState({grid : grid_state})
    const currentDate = (new Date()).toISOString()
    var options = {
      method: 'POST',
      url: 'https://swmllargy4.execute-api.us-east-1.amazonaws.com/prod/auth0proxy_auth0proxy',
      headers:
      {
        'content-type': 'application/json',
      },
      body: { user_id: this.state.profile.user_id, grid: { table: grid_state, timestamp: currentDate, currentTab: currentTab }},
      json: true
    }
    localStorage.setItem('current_grid', JSON.stringify({table: grid_state, timestamp: currentDate, currentTab: currentTab }))
    request(options)
    if (grid_state[currentTab] === undefined){
      currentTab = Object.keys(grid_state)[0]
    }
    this._generateLayout(grid_state[currentTab].grid)
  }
}
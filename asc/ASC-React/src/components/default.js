import React, { Component } from 'react';
// import 'onsenui/css/onsenui.css';
// import 'onsenui/css/onsen-css-components.css';
// import ons from 'onsenui';
import {List, ListItem, Page, Tabbar, Tab, Toolbar, Fab, BackButton, Icon, Splitter, SplitterSide, SplitterContent} from 'react-onsenui';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
    this.state = {isOpen: false, index: 1};
  }
  hide() {
    this.setState({isOpen: false});
  }
  show() {
    this.setState({isOpen: true});
  }
  renderTabs() {
    return [
      {
        content: <Page1 key='1'/>,
        tab: <Tab label='Page1' icon='md-home' key='b1' />
      },
      {
        content: <Page2 key='t2'/>,
        tab: <Tab label='Page 2' icon='md-home' key='b2' />
      },
      {
        content: <Page3 key='t3'/>,
        tab: <Tab label='Page 3' icon='md-home' key='b3' />
      }
    ];
  }
  render() {
    console.log(this.state);
    return (
      <Splitter>
        <SplitterSide
          style={{boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'}}
          side='left'
          width={200}
          collapse={true}
          isSwipeable={true}
          isOpen={this.state.isOpen}
          onClose={this.hide}
          onOpen={this.show}
        >
          <Page>
            <List
              dataSource={['Profile', 'Followers', 'Settings']}
              renderRow={(title) => (
                <ListItem key={title} onClick={this.hide} tappable>{title}</ListItem>
              )}
            />
          </Page>
        </SplitterSide>
        <SplitterContent>
          <Page>
                <Tabbar	index={this.state.index}
                        onPreChange={(event) => { console.log(event); if (event.index !== this.state.index) { this.setState({index: event.index}); } }}
                        renderTabs={this.renderTabs}
                />
            </Page>
        </SplitterContent>
      </Splitter>
    );
  }
}

class Page1 extends Component {
  render() {
    return (
      <Page>
        <div>Page 1</div>
      </Page>
    );
  }
}

class Page2 extends Component {
  constructor() {
    super();
    this.state = {showTest: false};
  }

  showTest(show) {
    this.setState({showTest: show});
  }

  render() {
    return (
      this.state.showTest ? <Show2 showTest={(show) => this.showTest(show) } />
        : <Show1 showTest={(show) => this.showTest(show) } />
    );
  }
}

class Show1 extends Component {
  renderToolbar() {
    return (
      <Toolbar>
        <div className='center'>Show 1</div>
      </Toolbar>
    );
  }
  renderFixed() {
    return (
      <Fab position='bottom right' onClick={() => this.props.showTest(true)}><Icon icon='md-plus'/></Fab>
    );
  }
  render() {
    return (
      <Page renderToolbar={this.renderToolbar} renderFixed={() => this.renderFixed()}>Show 1</Page>
    );
  }
}

class Show2 extends Component {
  renderToolbar() {
    return (
      <Toolbar>
        <div className='left'><BackButton onClick={() => this.props.showTest(false)}>Back</BackButton></div>
        <div className='center'>Show 2</div>
      </Toolbar>
    );
  }
  render() {
    return (
      <Page renderToolbar={() => this.renderToolbar()}>Show 2</Page>
    );
  }
}

class Page3 extends Component {
  render() {
    return (
      <Page>
        <div>Page 3</div>
      </Page>
    );
  }
}

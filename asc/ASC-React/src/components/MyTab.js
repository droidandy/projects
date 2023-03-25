import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as navigatorActions from '../redux/navigator';
import * as panelActions from '../redux/panel';

import {
  Page
} from 'react-onsenui';

import ToolbarMobile from './ToolbarMobile';

@connect((state) => ({ navigator: state.navigator, panel: state.panel, utility: state.utility }), (dispatch) => ({ actions: bindActionCreators({...navigatorActions, ...panelActions}, dispatch) }))

class MyTab extends React.Component {
  constructor(props) {
    super(props);
    this.renderToolbar = this.renderToolbar.bind(this);
    this.state = { };
  }

  renderToolbar() {
    return (
      this.props.utility.isMobile
        ? <ToolbarMobile />
        : null
    );
  }

  render() {
    return (
      <Page renderToolbar={this.renderToolbar}>
        <section style={{margin: '16px'}}>
          <p>
            This is the <strong>{this.props.title}</strong> tab.
          </p>
        </section>
      </Page>
    );
  }
}

export default MyTab;

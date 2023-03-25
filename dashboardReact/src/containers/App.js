import React, { Component, PropTypes } from 'react';
import {
    withRouter
} from 'react-router';
import {
    routerShape,
    locationShape
} from 'react-router/lib/PropTypes';
import {
    connect
} from 'react-redux';
import {
    compose
} from 'lodash/fp';
import {
    setStatus
} from 'actions/ui/hamburger';
import Page from 'components/Page';
import Sidebar from 'react-sidebar';
import SideBarContent from 'components/Sidebar';

class AppContainer extends Component {
    render() {
        return (
            <Sidebar sidebar={<SideBarContent onClosePanel={this.props.setStatus}/>}
                     pullRight
                     open={this.props.hamburger.active}
                     onSetOpen={this.props.setStatus}
                     styles={{
                         sidebar: {
                             backgroundColor: '#173A37',
                             zIndex: 10004
                         },
                         overlay: {
                             zIndex: 10003
                         }
                     }}
            >
                <Page {...this.props} />
            </Sidebar>

        );
    }
}

AppContainer.propTypes = {
    router: routerShape.isRequired,
    location: locationShape.isRequired,

    setStatus: PropTypes.func.isRequired,
    hamburger: PropTypes.object.isRequired
};

function select({ ui }) {

    return {
        hamburger: ui.hamburger
    };
}

const bindActions = {
    setStatus
};

export default compose(
    connect(select, bindActions),
    withRouter
)(AppContainer);

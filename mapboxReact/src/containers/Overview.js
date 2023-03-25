import React, { Component } from 'react';
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

import Overview from 'components/Overview';


class OverviewContainer extends Component {
    render() {
        return (
            <Overview/>
        );
    }
}

OverviewContainer.propTypes = {
    router: routerShape.isRequired,
    location: locationShape.isRequired
};

function select({ ui }) {

    return {};
}

const bindActions = {};

export default compose(
    connect(select, bindActions),
    withRouter
)(OverviewContainer);

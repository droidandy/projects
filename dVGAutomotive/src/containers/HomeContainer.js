import React, { Component, PropTypes } from 'react';
import {
    connect
} from 'react-redux'
import Home from '../components/Home'

import { setFirstLaunch } from '../actions/firstLaunch'

class HomeContainer extends Component {
    render() {
        return (
            <Home {...this.props}/>
        );
    }
}
HomeContainer.propTypes = {
    autoRehydrated: PropTypes.bool.isRequired,
    setFirstLaunch: PropTypes.func.isRequired,

};
function select(state) {

    const { autoRehydrated, firstLaunch  } = state;

    return {
        autoRehydrated,
        firstLaunch
    };
}

const bindActions = {
    setFirstLaunch
};

export default connect(select, bindActions)(HomeContainer)

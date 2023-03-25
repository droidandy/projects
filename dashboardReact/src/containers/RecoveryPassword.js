import React, { Component, PropTypes } from 'react';
import {
    withRouter
} from 'react-router';
import {
    connect
} from 'react-redux';
import {
    compose
} from 'lodash/fp';

import {
    showNotification,
    hideNotification
} from 'actions/ui/notification';
import RecoveryPassword from 'components/RecoveryPassword';
import ChangePassword from 'components/ChangePassword';


class RecoveryPasswordContainer extends Component {
    render() {
        return this.props.params.code ? (
            <ChangePassword/>
        ) : (
            <RecoveryPassword/>
        );
    }
}

RecoveryPasswordContainer.propTypes = {
    params: PropTypes.shape({
        code: PropTypes.string
    }).isRequired,

    notification: PropTypes.array.isRequired,

    showNotification: PropTypes.func.isRequired,
    hideNotification: PropTypes.func.isRequired
};

function select({ ui }) {
    return {
        notification: ui.notifications
    };
}

const bindActions = {
    showNotification,
    hideNotification
};


export default compose(
    connect(select, bindActions),
    withRouter
)(RecoveryPasswordContainer);

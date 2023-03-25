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
    showNotification,
    hideNotification
} from 'actions/ui/notification';
import Login from 'components/Login';


class LoginContainer extends Component {
    componentDidUpdate() {
        // const { user, location, router } = this.props;
        //
        // if (user.isJust) {
        //     if (location.state && location.state.nextPathname) {
        //         router.replace(location.state.nextPathname);
        //     } else {
        //         router.replace('/');
        //     }
        // }
    }

    render() {
        return (
            <Login
                {...this.props.notification}
            />
        );
    }
}

LoginContainer.propTypes = {
    router: routerShape.isRequired,
    location: locationShape.isRequired,

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
)(LoginContainer);

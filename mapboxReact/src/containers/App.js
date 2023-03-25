import React, { Component } from 'react';

import Page from 'components/Page';

class AppContainer extends Component {
    render() {
        return (
            <Page {...this.props} />
        );
    }
}

export default AppContainer;

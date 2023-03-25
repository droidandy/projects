import React, { PropTypes, Component } from 'react';

class Root extends Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
Root.propTypes = {
    children: PropTypes.object.isRequired
};
export default Root;

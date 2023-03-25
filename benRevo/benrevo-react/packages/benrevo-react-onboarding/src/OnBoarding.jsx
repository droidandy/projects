import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Navigation from './Navigation';
import { getAnswers } from './actions';

class OnBoarding extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
    routes: PropTypes.array,
    client: PropTypes.object,
    getAnswers: PropTypes.func,
  };

  componentWillMount() {
    let props = this.props;
    if (props.client.id) {
      props.getAnswers();
    }
  }

  render() {
    const { client, routes } = this.props;
    return (
      <div className="on-boarding">
        <Navigation client={client} routes={routes} />
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const clientsState = state.get('clients');
  return {
    client: clientsState.get('current').toJS(),
    routes: ownProps.route.childRoutes,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    getAnswers: () => { dispatch(getAnswers()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OnBoarding);

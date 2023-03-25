import React, { PureComponent, createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StepsPopup, ImportUsers } from 'components';
import Welcome from './Welcome';
import Tutorial from './Tutorial';
import dispatchers from 'js/redux/app/session.dispatchers';

function mapStateToProps(state) {
  return { isAdmin: state.session.can.administrateCompany };
}

class OnboardingPopup extends PureComponent {
  static propTypes = {
    isAdmin: PropTypes.bool,
    onboard: PropTypes.func
  };

  componentDidMount() {
    //TODO: possibly implement onOpen and call onboard() from there
    this.props.onboard();
  }

  render() {
    const { isAdmin } = this.props;
    const children = isAdmin ? [Welcome, Tutorial, ImportUsers] : [Welcome, Tutorial];

    return (
      <StepsPopup>
        { children.map((c, i) => createElement(c, { key: i })) }
      </StepsPopup>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(OnboardingPopup);

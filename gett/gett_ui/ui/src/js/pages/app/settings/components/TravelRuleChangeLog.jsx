import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ChangeLog } from 'components';
import dispatchers from 'js/redux/app/settings.dispatchers';

function mapStateToProps(state) {
  return { items: state.settings.travelRules.changeLog };
}

class TravelRuleChangeLog extends PureComponent {
  static propTypes = {
    items: PropTypes.array,
    travelRuleId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]).isRequired,
    getLog: PropTypes.func
  };

  render() {
    const { travelRuleId, getLog, items } = this.props;

    return <ChangeLog id={ travelRuleId } getLog={ getLog } items={ items } />;
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(TravelRuleChangeLog);

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ChangeLog } from 'components';
import dispatchers from 'js/redux/admin/companies.dispatchers';

function mapStateToProps(state) {
  return { items: state.companies.changeLog };
}

class CompanyChangeLog extends PureComponent {
  static propTypes = {
    items: PropTypes.array,
    companyId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    getLog: PropTypes.func
  };

  render() {
    const { companyId, getLog, items } = this.props;

    return <ChangeLog id={ companyId } getLog={ getLog } items={ items } />;
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(CompanyChangeLog);

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Button } from 'components';
import { auth, post } from 'utils';

export default class AscensionBlock extends PureComponent {
  static propTypes = {
    companyName: PropTypes.string
  };

  ascend = () => {
    post('/admin/session/ascend')
      .then(({ data }) => auth.accept(data));
  };

  render() {
    const { companyName } = this.props;

    return (
      <div className="message layout horizontal center-center white-text">
        Logged in as Admin of <span className="bold-text mr-10 ml-5">{ companyName }</span>
        <Button type="primary" onClick={ this.ascend }>Return to Back Office</Button>
      </div>
    );
  }
}

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router';
import { getInitials } from '../../../utils/query';
import { ACCESS_STATUS_START, ACCESS_STATUS_STOP } from '../../Client/Details/constants';

class HeaderAccess extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    client: PropTypes.object.isRequired,
    accessStatus: PropTypes.string.isRequired,
    changeAccessStatus: PropTypes.func.isRequired,
  };

  render() {
    const { client, accessStatus, changeAccessStatus } = this.props;

    return (
      <div className="app-header access">
        <div className="access-inner">
          <div className="access-inner-left">
            <span className="access-inner-initials">{getInitials(client.clientName)}</span>
            <span className={`access-inner-name ${accessStatus !== ACCESS_STATUS_START ? 'full' : ''}`}>{client.clientName}</span>
          </div>
          { accessStatus === ACCESS_STATUS_START &&
            <div className="access-inner-start">
              <span className="access-inner-note">Note: Any additions or changes you make will be reflected in the Brokers account.</span>
              <Button
                as={Link}
                to={`/client/${client.clientId}`}
                basic
                className="white-text"
                size="medium"
                onClick={() => { changeAccessStatus(ACCESS_STATUS_STOP); }}
              >Exit Broker Account</Button>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default HeaderAccess;

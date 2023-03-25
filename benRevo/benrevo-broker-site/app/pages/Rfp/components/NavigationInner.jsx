import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Menu } from 'semantic-ui-react';
import messages from './messages';
import * as types from '../constants';

class Navigation extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    client: PropTypes.object.isRequired,
    products: PropTypes.object.isRequired,
    virginCoverage: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    clearCarrierData: PropTypes.func.isRequired,
  };

  render() {
    const {
      client,
      products,
      virginCoverage,
      type,
      clearCarrierData,
    } = this.props;
    const prefix = `/clients/${client.id}`;
    let color = 'grey';

    if (type === 'rfp') color = 'green';

    return (
      <Menu stackable className={color}>
        <Menu.Item as={Link} to={`${prefix}/rfp/client`} activeClassName="active">
          <FormattedMessage {...messages.client} />
        </Menu.Item>
        { products[types.RFP_MEDICAL_SECTION] &&
        <Menu.Item as={Link} to={`${prefix}/rfp/medical`} activeClassName="active">
          <FormattedMessage {...messages.medical} />
        </Menu.Item>
        }
        { products[types.RFP_DENTAL_SECTION] &&
        <Menu.Item as={Link} to={`${prefix}/rfp/dental`} activeClassName="active">
          <FormattedMessage {...messages.dental} />
        </Menu.Item>
        }
        { products[types.RFP_VISION_SECTION] &&
        <Menu.Item as={Link} to={`${prefix}/rfp/vision`} activeClassName="active">
          <FormattedMessage {...messages.vision} />
        </Menu.Item>
        }
        { products[types.RFP_LIFE_SECTION] &&
        <Menu.Item as={Link} to={`${prefix}/rfp/life`} activeClassName="active">
          <FormattedMessage {...messages.life} />
        </Menu.Item>
        }
        { products[types.RFP_STD_SECTION] &&
        <Menu.Item as={Link} to={`${prefix}/rfp/std`} activeClassName="active">
          <FormattedMessage {...messages.std} />
        </Menu.Item>
        }
        { products[types.RFP_LTD_SECTION] &&
        <Menu.Item as={Link} to={`${prefix}/rfp/ltd`} activeClassName="active">
          <FormattedMessage {...messages.ltd} />
        </Menu.Item>
        }
        {((products.medical && !virginCoverage.medical) ||
          (products.dental && !virginCoverage.dental) ||
          (products.vision && !virginCoverage.vision) ||
          (products.life && !virginCoverage.life) ||
          (products.std && !virginCoverage.std) ||
          (products.ltd && !virginCoverage.ltd)
        ) &&
        <Menu.Item as={Link} to={`${prefix}/rfp/rates`} activeClassName="active">
          <FormattedMessage {...messages.rates} />
        </Menu.Item>
        }

        {((products.medical && !virginCoverage.medical) || (products.dental && !virginCoverage.dental) || (products.vision && !virginCoverage.vision)) &&
        <Menu.Item as={Link} to={`${prefix}/rfp/enrollment`} activeClassName="active">
          <FormattedMessage {...messages.enrollment} />
        </Menu.Item>
        }
        <Menu.Item as={Link} to={`${prefix}/rfp/team`} activeClassName="active">
          <FormattedMessage {...messages.team} />
        </Menu.Item>
        <div className="button-group">
          <Menu.Item as={Link} to={`${prefix}/rfp/send-to-carrier`} className="button" onClick={clearCarrierData}>
            <span>Send to Carrier</span>
          </Menu.Item>
        </div>
      </Menu>
    );
  }
}

export default Navigation;

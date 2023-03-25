import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Menu, Grid } from 'semantic-ui-react';
import messages from './messages';
import * as types from '../constants';

class NavigationRfp extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    client: PropTypes.object,
    carrierName: PropTypes.string,
    products: PropTypes.object.isRequired,
    virginCoverage: PropTypes.object.isRequired,
  };

  render() {
    const { products, virginCoverage, carrierName } = this.props;
    return (
      <div className="responsive-nav">
        <Grid stackable container>
          <Grid.Column width={16}>
            <Menu stackable>
              <Menu.Item as={Link} className="clientName">
                {this.props.client.clientName &&
                <div>Client: <span>{this.props.client.clientName}</span></div>
                }
              </Menu.Item>
              <Menu.Item as={Link} to="/rfp/client" activeClassName="active">
                <FormattedMessage {...messages.client} />
              </Menu.Item>
              { products[types.RFP_MEDICAL_SECTION] &&
                <Menu.Item as={Link} to="/rfp/medical" activeClassName="active">
                  <FormattedMessage {...messages.medical} />
                </Menu.Item>
              }
              { products[types.RFP_DENTAL_SECTION] &&
                <Menu.Item as={Link} to="/rfp/dental" activeClassName="active">
                  <FormattedMessage {...messages.dental} />
                </Menu.Item>
              }
              { products[types.RFP_VISION_SECTION] &&
                <Menu.Item as={Link} to="/rfp/vision" activeClassName="active">
                  <FormattedMessage {...messages.vision} />
                </Menu.Item>
              }
              { products[types.RFP_LIFE_SECTION] &&
                <Menu.Item as={Link} to="/rfp/life" activeClassName="active">
                  <FormattedMessage {...messages.life} />
                </Menu.Item>
              }
              { products[types.RFP_STD_SECTION] &&
                <Menu.Item as={Link} to="/rfp/std" activeClassName="active">
                  <FormattedMessage {...messages.std} />
                </Menu.Item>
              }
              { products[types.RFP_LTD_SECTION] &&
                <Menu.Item as={Link} to="/rfp/ltd" activeClassName="active">
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
              <Menu.Item as={Link} to="/rfp/rates" activeClassName="active">
                <FormattedMessage {...messages.rates} />
              </Menu.Item>
              }

              {((products.medical && !virginCoverage.medical) || (products.dental && !virginCoverage.dental) || (products.vision && !virginCoverage.vision)) &&
                <Menu.Item as={Link} to="/rfp/enrollment" activeClassName="active">
                  <FormattedMessage {...messages.enrollment} />
                </Menu.Item>
              }
              <Menu.Item as={Link} to="/rfp/team" activeClassName="active">
                <FormattedMessage {...messages.team} />
              </Menu.Item>
              <Menu.Item as={Link} to="/rfp/send-to-carrier">
                {/* <Label className='responsive-nav-carrier-label'>1</Label>*/}
                <span>{`Send to ${carrierName}`}</span>
                <span className="folder-icon-image"></span>
              </Menu.Item>
            </Menu>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default NavigationRfp;

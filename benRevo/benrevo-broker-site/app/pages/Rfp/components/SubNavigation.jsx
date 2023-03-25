import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { Menu } from 'semantic-ui-react';

class SubNavigation extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    route: PropTypes.object.isRequired,
    messages: PropTypes.object.isRequired,
    parent: PropTypes.string.isRequired,
    prefix: PropTypes.string.isRequired,
    products: PropTypes.object.isRequired,
    virginCoverage: PropTypes.object.isRequired,
  };

  render() {
    const { products, virginCoverage } = this.props;
    let counter = 0;
    return (
      <div>
        <Menu pointing secondary className="rfp-tab-top-menu">
          {this.props.route.childRoutes && this.props.route.childRoutes.map(
            (item, i) => {
              const parentCoverage = (virginCoverage) ? virginCoverage[this.props.route.path] : false;
              if ((((products && products[item.path]) !== false) && ((virginCoverage && virginCoverage[item.path] !== true))) || !products) {
                counter += 1;
                return (
                  <Menu.Item
                    as={Link}
                    to={`${this.props.prefix || ''}/${this.props.parent}/${this.props.route.path}/${item.path}`}
                    key={i}
                    activeClassName="active"
                  >
                    <span className="counter">{`${counter}. `}</span>
                    <FormattedMessage {...this.props.messages[(parentCoverage && item.path === 'options') ? 'optionsVirgin' : item.path]} />
                  </Menu.Item>
                );
              }

              return true;
            }
          )}
          { !this.props.route.childRoutes &&
            <Menu.Item
              as={Link}
              to={`${this.props.prefix || ''}/${this.props.parent}/${this.props.route.path}`}
              activeClassName="active"
            >
              <span className="counter">1.</span>
              <FormattedMessage {...this.props.messages[this.props.route.path]} />
            </Menu.Item>
          }
        </Menu>
      </div>
    );
  }
}

export default SubNavigation;

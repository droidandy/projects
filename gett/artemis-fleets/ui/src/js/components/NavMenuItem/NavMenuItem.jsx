import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Icon } from 'components';
import { Row, Tooltip } from 'antd';
import CN from 'classnames';

import css from './NavMenuItem.css';

// NavMenuItem should not be Pure in react's meaning of purity, since all
// NavLinks in it should be updated on each route change to properly handle
// their 'active' state.
export default class NavMenuItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    subItems: PropTypes.array,
    collapsed: PropTypes.bool,
    onClick: PropTypes.func
  };

  static defaultProps = {
    collapsed: false
  };

  state = {
    showSubmenu: false
  };

  toggleSubmenu = () => {
    this.setState({ showSubmenu: !this.state.showSubmenu });
  };

  handleClick = () => {
    const { subItems, onClick } = this.props;
    if (subItems) {
      this.toggleSubmenu();
    } else if (onClick) {
      onClick();
    }
  };

  isActiveLink = (match, location) => {
    const { items } = this.props.item;

    return match || (!this.state.showSubmenu && items && items.map(i => i.to).includes(location.pathname));
  };

  render() {
    const { item: { to, exact, icon, title }, subItems, onClick, collapsed } = this.props;
    const { showSubmenu } = this.state;

    const item = (<div>
      <Icon className="text-22 mr-10" icon={ icon } />
      { !collapsed && title }
    </div>);

    return (
      <div>
        <NavLink
          exact={ exact }
          to={ to }
          activeClassName={ css.active }
          className="block white-text pt-10 pb-10 pl-15 pr-10"
          onClick={ this.handleClick }
          isActive={ this.isActiveLink }
        >
          <Row type="flex" justify="space-between">
            { collapsed
              ? <Tooltip placement="right" title={ title } mouseEnterDelay={ 0.3 }>
                  { item }
                </Tooltip>
              : item
            }
            { subItems &&
              <Icon className="text-22" icon={ showSubmenu ? 'MdKeyboardArrowUp' : 'MdKeyboardArrowDown' } />
            }
          </Row>
        </NavLink>
        { subItems && showSubmenu &&
          <div className={ CN('mb-10', { 'ml-40': !collapsed }) }>
            { subItems.map((item, i) => (
              <NavLink
                key={ i }
                to={ item.to }
                className={ CN('white-text pt-5 pb-5 pl-5 pr-10 text-12 block', { 'pl-15': collapsed }) }
                onClick={ onClick }
                activeClassName={ css.active }
              >
                { collapsed
                  ? <Tooltip placement="right" title={ item.title } mouseEnterDelay={ 0.3 }>
                      <Icon className="text-22" icon={ item.icon } />
                    </Tooltip>
                  : item.title
                }
              </NavLink>
            )) }
          </div>
        }
      </div>
    );
  }
}

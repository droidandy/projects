import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Icon } from 'components';

import css from './NavMenuItem.css';

export default class NavMenuItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    onClick: PropTypes.func
  };

  state = {
    showSubmenu: false
  };

  toggleSubmenu = () => {
    this.setState({ showSubmenu: !this.state.showSubmenu });
  };

  handleClick = () => {
    const { item, onClick } = this.props;
    if (item.items) {
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
    const { item: { to, exact, icon, title, items }, onClick } = this.props;
    const { showSubmenu } = this.state;

    return (
      <div>
        <NavLink
          exact={ exact }
          to={ to }
          activeClassName={ css.active }
          className="block white-text bold-text p-10 pr-15"
          onClick={ this.handleClick }
          isActive={ this.isActiveLink }
        >
          <div className="layout horizontal center">
            { items &&
              <Icon className="text-22" icon={ showSubmenu ? 'MdKeyboardArrowUp' : 'MdKeyboardArrowDown' } />
            }
            <div className="layout horizontal center justified-right">
              { title }
              <Icon className="text-22 ml-10" icon={ icon } />
            </div>
          </div>
        </NavLink>
        { items && showSubmenu &&
          <div className="mb-10 text-right">
            { items.map((item, i) => (
              <NavLink
                key={ i }
                to={ item.to }
                className={ `white-text bold-text p-5 text-12 block ${css.subItem}` }
                onClick={ onClick }
                activeClassName={ css.active }
              >
                { item.title }
              </NavLink>
            )) }
          </div>
        }
      </div>
    );
  }
}

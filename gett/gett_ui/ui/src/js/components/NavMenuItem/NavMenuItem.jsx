import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Icon } from 'components';
import CN from 'classnames';

import css from './NavMenuItem.css';

// NavMenuItem should not be Pure in react's meaning of purity, since all
// NavLinks in it should be updated on each route change to properly handle
// their 'active' state.
export default class NavMenuItem extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  static propTypes = {
    item: PropTypes.object.isRequired,
    subItems: PropTypes.array,
    onClick: PropTypes.func
  };

  state = {
    showSubmenu: false
  };

  componentDidMount() {
    const { pathname } = this.context.router.route.location;
    const { base } = this.props.item;

    if (base && pathname.split('/')[1] === base) {
      this.setState({ showSubmenu: true });
    }
  }

  toggleSubmenu = () => {
    this.setState({ showSubmenu: !this.state.showSubmenu });
  };

  handleClick = (e) => {
    const { subItems, onClick, item: { to } } = this.props;

    e.currentTarget.blur();

    if (subItems) {
      this.toggleSubmenu();
      e.preventDefault();
    } else if (onClick) {
      onClick(to);
    }
  };

  isActiveLink = (match, location) => {
    const { items, exclude, base } = this.props.item;

    return match && location.pathname !== exclude || (items && location.pathname.split('/')[1] === base);
  };

  render() {
    const { item: { to, exact, icon, title, href }, subItems, onClick } = this.props;
    const { showSubmenu } = this.state;

    return (
      <Fragment>
        { href
          ? <a
              target="_blank"
              rel="noopener noreferrer"
              href={ href }
              className={ CN('layout horizontal center pl-30 pr-30', css.menuItem) }
            >
              <Icon className={ CN('text-22 mr-20', css.icon) } icon={ icon } />
              <div className="bold-text">{ title }</div>
            </a>
          : <Fragment>
              <NavLink
                exact={ exact }
                to={ to }
                activeClassName={ css.active }
                className={ CN('layout horizontal center pl-30 pr-30', css.menuItem) }
                onClick={ this.handleClick }
                isActive={ this.isActiveLink }
              >
                <div className="flex layout horizontal center">
                  <Icon className={ CN('text-22 mr-20', css.icon) } icon={ icon } />
                  <div className="bold-text">{ title }</div>
                </div>
                { subItems &&
                  <Icon className={ CN('text-22', css.icon) } icon={ showSubmenu ? 'MdKeyboardArrowUp' : 'MdKeyboardArrowDown' } />
                }
              </NavLink>
              { subItems &&
                <div className={ CN(css.subMenu, { [css.show]: showSubmenu }) }>
                  { subItems.map((item, i) => (
                    <NavLink
                      key={ i }
                      to={ item.to }
                      className={ CN('layout horizontal center text-12', css.menuItem, css.subMenuItem) }
                      onClick={ onClick.bind(this, item.to) }
                      activeClassName={ css.active }
                    >
                      { item.title }
                    </NavLink>
                  )) }
                </div>
              }
            </Fragment>
        }
      </Fragment>
    );
  }
}

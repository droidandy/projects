import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { NavMenuItem, Icon } from 'components';

// SidebarMenu should not be Pure in react's meaning of purity, since all
// NavMenuItems in it should be updated on each route change to properly handle
// their 'active' state.
export default class SidebarMenu extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    can: PropTypes.object,
    onClick: PropTypes.func
  };

  render() {
    const { items, can, onClick } = this.props;

    return (
      <Fragment>
        <div>
          { items.map((item, i) =>
            (!item.if || item.if(can)) &&
              <NavMenuItem
                key={ i }
                dataIndex={ i }
                item={ item }
                onClick={ onClick }
                subItems={ item.items && item.items.filter(i => (!i.if || i.if(can))) }
              />
          ) }
        </div>
        <div className="flex layout ml-30 mr-30 mt-10 bold-text">
          <div className="border-bottom" />
          <div className="mb-20 mt-20">
            <a href="https://gett.com/uk/contact-gbs/" className="grey-link">Contact us</a>
          </div>
          <div className="mb-20">
            <Link to="/terms-and-conditions" className="grey-link">Terms & Conditions</Link>
          </div>
          <div>
            <Link to="/privacy-policy" className="grey-link">Privacy Policy</Link>
          </div>
        </div>
        <Link className="black-text center-block mb-20 mt-20" to="/">
          <Icon icon="LogoOT" width={ 130 } height={ 50 } />
        </Link>
      </Fragment>
    );
  }
}

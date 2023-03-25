import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { UserPhoto } from 'components';

export default class UserDetails extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    centered: PropTypes.bool,
  };

  static defaultProps = {
    title: '',
    subTitle: '',
    centered: false,
  };

  render() {
    const { data, title, subTitle, centered } = this.props;
    const hasTitle = data?.title || title;
    const hasSubTitle = data?.subTitle || subTitle;

    return (
      <div className={`userDetails ${centered ? 'centered' : ''}`}>
        <UserPhoto data={data} />
        <div className="info">
          {hasTitle && <div className="name">{hasTitle}</div>}
          {hasSubTitle && <div className="subTitle">{hasSubTitle}</div>}
        </div>
      </div>
    );
  }
}

import React, { Component, Fragment } from 'react';
import { Call, Email, LocationOn, Launch, PhotoLibrary } from '@material-ui/icons';
import PropTypes from 'prop-types';

export default class UserProfileDetails extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  get collection() {
    const { data } = this.props;
    const { followings, followers } = data.counters;

    const article = data.articlesTop || [];
    const property = data.propertiesTop || [];
    const counter = [];

    if (followers > 0) {
      counter.push({ label: 'Followers', value: followers });
    }
    if (followings > 0) {
      counter.push({ label: 'Following', value: followings });
    }

    const contact = [];

    if (data.phone) {
      contact.push({
        ComponentIcon: Call,
        label: <a href={`tel:${data.phone}`}>{data.phone}</a>,
        subLabel: 'Mobile',
      });
    }

    if (data.email) {
      contact.push({
        ComponentIcon: Email,
        label: <a href={`mailto:${data.email}`}>{data.email}</a>,
        subLabel: 'Primary',
      });
    }

    if (data.address) {
      contact.push({
        ComponentIcon: LocationOn,
        label: '752 Douglas Street, Victoria, BC, V8W 3M6',
        subLabel: 'Office',
      });
    }

    if (data.url.details) {
      contact.push({
        ComponentIcon: Launch,
        label: <a href={data.url.details}>Website</a>,
        subLabel: 'Source',
      });
    }

    return { article, property, counter, contact };
  }

  get sections() {
    const { article, property, counter, contact } = this.collection;
    const homes = { label: 'Homes', collection: property, chevronHide: true };
    const stories = { label: 'Stories', collection: article };
    const counters = { className: 'counters', collection: counter, renderItem: this.renderCounterSection };
    const contacts = { label: 'Contact', className: 'contacts', collection: contact, renderItem: this.renderDetails };

    return [homes, stories, counters, contacts];
  }

  renderItem = item => (
    <div
      key={item.id}
      className="picture cover"
      style={{ background: `url(${item.thumbnail.s})` }}
    >
      <div className="fullscreen">
        <div className="icon">
          <PhotoLibrary />
        </div>
      </div>
    </div>
  );

  renderCounterSection = ({ label = '', value = 0 }, index, collection) => {
    return value > 0 ? (
      <Fragment key={label || index}>
        <div className="data">
          <div className="value">{value}</div>
          {label && <div className="label">{label}</div>}
        </div>
        {index + 1 !== collection.length && <div className="verticalDevider" />}
      </Fragment>
    ) : <Fragment key={label || index} />;
  };

  renderTitles = ({ label = '', subLabel = '' }, ind) => (
    <div className="item" key={label || ind}>
      {label && <div className="label">{label}</div>}
      {subLabel && <div className="subLabel">{subLabel}</div>}
    </div>
  );

  renderDetails = ({ ComponentIcon, items = [], label = '', subLabel = '' }, index, collection) => {
    const icon = ComponentIcon && <ComponentIcon className="icon" />;
    return (
      <Fragment key={index}>
        <div className="details">
          {icon}
          <div className="items">
            {items.length > 0
              ? items.map(this.renderTitles)
              : this.renderTitles({ label, subLabel })
            }
          </div>
        </div>
        {index + 1 !== collection.length && <hr />}
      </Fragment>
    );
  };

  renderSection = (
    { label = '', collection, className = 'collection', renderItem = this.renderItem, chevronHide = false },
    index,
  ) => {
    return collection.length > 0 ? (
      <div key={label || index} className="section">
        {label && <div className="title">{label}</div>}
        <div className={className}>{collection.map(renderItem)}</div>
        {!chevronHide && <hr />}
      </div>
    ) : <Fragment key={label || index} />;
  };

  render() {
    const { data } = this.props;

    return (
      <Fragment>
        {this.sections.map(this.renderSection)}
        <div className="contactDetails">
          {data.intro ? (
            <div className="intro">
              <hr />
              {data.intro} ...
            </div>
          ) : <Fragment />}
        </div>
      </Fragment>
    );
  }
}

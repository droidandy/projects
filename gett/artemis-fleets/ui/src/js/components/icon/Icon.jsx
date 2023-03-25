import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import CN from 'classnames';
import * as Icons from './IconLib';

export default function Icon({ icon, className, ...rest }) {
  if (typeof Icons[icon] !== 'function') {
    console.error(`Requested unknown icon '${icon}'`);
    return <div />;
  }

  return (
    <div className={ CN('inline-block lh-0', className) } { ...rest }>
      { createElement(Icons[icon]) }
    </div>
  );
}

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  className: PropTypes.string
};

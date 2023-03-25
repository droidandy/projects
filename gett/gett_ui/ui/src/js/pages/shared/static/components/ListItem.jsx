import React from 'react';
import PropTypes from 'prop-types';

export default function ListItem({ marker, children }) {
  return (
    <div className="layout horizontal mb-30 xs-wrap">
      <div className="w-60 mr-20 bold-text">{ marker }</div>
      <div className="flex xs-full-width">{ children }</div>
    </div>
  );
}

ListItem.propTypes = {
  children: PropTypes.node,
  marker: PropTypes.string
};

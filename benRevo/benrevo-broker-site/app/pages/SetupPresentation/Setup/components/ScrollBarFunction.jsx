import React from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';

export const WithScrollbar = ({
  enableScrollBar,
  children,
  optionsScrollBar,
  refs,
}) => enableScrollBar ? <PerfectScrollbar option={optionsScrollBar} ref={refs} className="alternatives-scrollbar">{children}</PerfectScrollbar> : <div>{children}</div>;

WithScrollbar.propTypes = {
  children: PropTypes.node.isRequired,
  enableScrollBar: PropTypes.bool.isRequired,
  optionsScrollBar: PropTypes.object.isRequired,
  refs: PropTypes.func.isRequired,
};

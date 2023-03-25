import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';

export default ({ children, ...props }) => {
  return <UncontrolledTooltip {...props}>{children}</UncontrolledTooltip>;
};

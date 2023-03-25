import React from 'react';
import IconBase from 'react-icon-base';
import PropTypes from 'prop-types';

export default function GettPin({ 'data-svg-props': { iconText }, ...rest }) {
  return (
    <IconBase viewBox="0 0 14 20" { ...rest }>
      <g>
        <path fillRule="nonzero" d="M14 6.928C14 3.102 10.866 0 7 0S0 3.102 0 6.928c0 .117.003.233.009.349A7.288 7.288 0 0 0 0 7.625C0 11.45 7 20 7 20s7-8.55 7-12.375a6.85 6.85 0 0 0-.009-.349c.006-.115.009-.231.009-.348zm-7 5.52a5.276 5.276 0 0 1-4.874-3.222 5.182 5.182 0 0 1 1.144-5.69 5.315 5.315 0 0 1 5.75-1.132 5.221 5.221 0 0 1 3.255 4.824c0 2.883-2.362 5.22-5.275 5.22z" />
        <text stroke="gray" x="50%" y="8" alignmentBaseline="middle" fontSize="8px" fontWeight="300" fontFamily="Arial, Helvetica, sans-serif" textAnchor="middle">{ iconText }</text>
      </g>
    </IconBase>
  );
}

GettPin.propTypes = {
  'data-svg-props': PropTypes.object
};

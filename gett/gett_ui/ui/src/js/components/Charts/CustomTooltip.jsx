import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';

import css from './style.css';
import CN from 'classnames';

export default function CustomTooltip(props) {
  const { payload, label } = props;

  return (
    <div className={ CN(css.tooltip, 'white-bg p-20 z-1') }>
      { label && <div className="text-12 bold-text grey-text mb-20">{ label }</div> }
      { map(payload, (entry, index) => (
          <div key={ `item-${index}` } className={ CN({ 'mt-20': index > 0 }, 'layout horizontal center') }>
            { entry.color &&
              <svg width="20" height="20" className="mr-15">
                <rect x="0" y="0" rx="4" ry="4" width="20" height="20" fill={ entry.color } />
              </svg>
            }
            <div className="text-12 bold-text grey-text">{ `${entry.name}: ${entry.value}` }</div>
          </div>
        ))
      }
    </div>
  );
}

CustomTooltip.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  payload: PropTypes.arrayOf(PropTypes.object)
};

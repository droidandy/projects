import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';

import CN from 'classnames';
import css from './style.css';

export default function CustomLegend(props) {
  const { payload } = props;

  return (
    <div className="layout horizontal center center-justified wrap">
      { map(payload, (entry, index) => (
          <div key={ `item-${index}` } className={ CN('layout horizontal center mb-20', css.legendItem) }>
            { entry.color &&
              <svg width="10" height="10" className="mr-15">
                <circle cx="5" cy="5" r="5" fill={ entry.color } />
              </svg>
            }
            <div className="text-12 bold-text medium-grey-text">{ entry.value }</div>
          </div>
        ))
      }
    </div>
  );
}

CustomLegend.propTypes = {
  payload: PropTypes.arrayOf(PropTypes.object)
};

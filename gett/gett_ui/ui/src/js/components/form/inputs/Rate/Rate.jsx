import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import range from 'lodash/range';
import { Tooltip } from 'antd';
import CN from 'classnames';
import css from './styles.css';

export default class Rate extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    labelClassName: PropTypes.string,
    error: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.number,
    maxRate: PropTypes.number
  };

  static defaultProps = {
    maxRate: 10
  };

  render() {
    const { className, label, labelClassName, error, maxRate } = this.props;
    return (
      <div className={ CN(css.wrapper, className) }>
        { label &&
          <Tooltip
            placement="left"
            title={ `Rating - from 1 to ${maxRate} how likely are you to recommend the platform` }
          >
            <label className={ CN('dark-grey-text ml-5', labelClassName) }>{ label }</label>
          </Tooltip>
        }
        <div className="layout horizontal center wrap">
          { range(1, maxRate + 1).map((item) => {
              return (
                <div
                  onClick={ () => this.props.onChange(item) }
                  className={ CN(css.rateItem, 'layout m-5 center-justified p-5 text-center pointer br-4', { [css.selected]: item === this.props.value }) }
                  key={ item }
                >
                  { item }
                </div>
              );
            })
          }
        </div>
        { error &&
          <div className="error">{ error }</div>
        }
      </div>
    );
  }
}

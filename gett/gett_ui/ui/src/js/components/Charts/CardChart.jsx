import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { snakeCase, capitalize, toUpper } from 'lodash';

import CN from 'classnames';
import css from './style.css';

export default class Chart extends PureComponent {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string
  };

  static defaultProps = {
    data: [],
    title: ''
  };

  renderCardItem({ name, value }, preLast) {
    return (
      <div key={ name } className={ CN({ [css.lightGreyBorderRight]: preLast }, 'flex text-center') }>
        <div className="text-24 bold-text black-text" data-name={ name }>{ value || 0 }</div>
        <div className="bold-text text-12 grey-text">{ name === 'asap' ? toUpper(name) : capitalize(name) }</div>
      </div>
    );
  }

  render() {
    const { data, title } = this.props;

    return (
      <div className="mb-20 chartContainer">
        <div className="pl-20 pr-20 pb-15 pt-15 dark-grey-text bold-text border-bottom">{ title }</div>
        <div className="mb-20 layout horizontal">
          <div className="flex layout horizontal center pt-20 pb-20" data-name={ snakeCase(title) }>
            { data.map((dataItem, index) => this.renderCardItem(dataItem, index == data.length - 2)) }
          </div>
        </div>
      </div>
    );
  }
}

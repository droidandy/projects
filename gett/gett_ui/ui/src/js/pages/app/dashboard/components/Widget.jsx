import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CN from 'classnames';
import css from './Widget.css';

export default class Widget extends PureComponent {

  static propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    className: PropTypes.string,
    contentProps: PropTypes.object
  }

  render() {
    const { children, title, className, contentProps } = this.props;

    return (
      <div className={ CN(css.widget, className) }>
        <div className={ css.title }>
          <div className={ css.titleName }>
            { title }
          </div>
        </div>
        <div className={ css.content } { ...contentProps } >
          { children }
        </div>
      </div>
    );
  }
}

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'components';
import CN from 'classnames';
import css from './Count.css';

class Count extends PureComponent {

  static propTypes = {
    icon: PropTypes.string.isRequired,
    count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string.isRequired,
    className: PropTypes.string,
    name: PropTypes.string
  }

  render() {
    const {
      title, count, icon, className, name
    } = this.props;

    return (
      <div className={ CN(css.count, 'white-bg', className) }>
        <div className={ css.icon }>
          <Icon icon={ icon } className="text-30" color="#fdb924" />
        </div>
        <div className={ CN(css.content, 'ml-20') }>
          <div className={ css.contentNumber } data-name={ name }>
            { count || 0 }
          </div>
          <div className={ CN(css.contentTitle, 'mt-10') }>
            { title }
          </div>
        </div>
      </div>
    );
  }
}

export default Count;

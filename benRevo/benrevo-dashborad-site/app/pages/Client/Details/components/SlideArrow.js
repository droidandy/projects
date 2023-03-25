import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';
import ChevronLeft from '../../../../assets/img/svg/icon-chevron-left.svg';
import ChevronRight from '../../../../assets/img/svg/icon-chevron-right.svg';

class CarouselArrow extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    direction: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
  };

  render() {
    const { className, style, onClick, direction } = this.props;
    return (
      <Image src={(direction === 'prev') ? ChevronLeft : ChevronRight} className={className} style={style} onClick={onClick} />
    );
  }
}

export default CarouselArrow;

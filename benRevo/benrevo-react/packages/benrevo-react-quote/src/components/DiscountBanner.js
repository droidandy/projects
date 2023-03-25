/**
 *
 * DiscountBanner
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { DiscountImg } from '@benrevo/benrevo-react-core';
import { LIFE, STD, LTD } from '../constants';

class DiscountBanner extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    visionBundleDiscountApplied: PropTypes.bool,
    extendedBundleDiscount: PropTypes.object,
    dentalBundleDiscountApplied: PropTypes.bool,
    position: PropTypes.string,
  };

  render() {
    const { visionBundleDiscountApplied, extendedBundleDiscount, dentalBundleDiscountApplied, position } = this.props;
    const life = extendedBundleDiscount[LIFE];
    const std = extendedBundleDiscount[STD];
    const ltd = extendedBundleDiscount[LTD];
    let count = 0;
    let text = '';

    if (dentalBundleDiscountApplied) count += 1;
    if (visionBundleDiscountApplied) count += 1;
    if (life) count += 1;
    if (std) count += 1;
    if (ltd) count += 1;


    if (!count) return (<div />);
    else if (count >= 3) {
      text = 'Multiple';
    } else {
      if (dentalBundleDiscountApplied) text += 'Dental';
      if (visionBundleDiscountApplied) text += `${text.length ? ' + ' : ' '}Vision`;
      if (life && life.discount) text += `${text.length ? ' + ' : ' '}Life`;
      if (std && std.discount) text += `${text.length ? ' + ' : ' '}STD`;
      if (ltd && ltd.discount) text += `${text.length ? ' + ' : ' '}LTD`;
    }

    text += ` Discount${count === 1 ? '' : 's'} Applied`;

    return (
      <div className={`discounts-applied ${position || ''}`}>
        <div className="discounts-applied-inner">
          <Image src={DiscountImg} inline />
          <Image src={DiscountImg} inline />
          <span>{text}</span>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const overviewState = state.get('presentation').get('final');
  return {
    dentalBundleDiscountApplied: overviewState.get('dentalBundleDiscountApplied'),
    extendedBundleDiscount: overviewState.get('extendedBundleDiscount').toJS(),
    visionBundleDiscountApplied: overviewState.get('visionBundleDiscountApplied'),
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(DiscountBanner);

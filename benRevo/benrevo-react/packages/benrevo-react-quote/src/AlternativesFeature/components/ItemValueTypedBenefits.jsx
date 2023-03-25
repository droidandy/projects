import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import { Popup } from 'semantic-ui-react';
import { extractFloat } from '@benrevo/benrevo-react-core';
import { DISCOUNT_MOTION } from '../../constants';
import Motion from './Motion';

class ItemValueTypedBenefits extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    item: PropTypes.object.isRequired,
    benefits: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.number,
    carrierName: PropTypes.string,
    motionLink: PropTypes.string,
  };

  state = {
    textOverflow: false,
  };

  componentDidMount() {
    if (this.spanText && (this.spanText.clientHeight !== this.spanText.scrollHeight)) {
      this.setState({ textOverflow: true });
    }
  }

  render() {
    const { item, benefits, carrierName, motionLink } = this.props;
    const hoverable = true;
    const elemStyle = {
      display: 'block',
      overflow: 'hidden',
      fontSize: 13,
      height: 23,
      lineHeight: '23px',
      fontWeight: 600,
    };

    if (!this.state.textOverflow) {
      return (
        <span style={elemStyle} ref={spanText => this.spanText = spanText}>
          <FormattedBlock
            benefits={benefits}
            newStyle={null}
            item={item}
            carrierName={carrierName}
            motionLink={motionLink}
          />
        </span>
      );
    }
    return (
      <Popup
        className="alternatives-plan-name-popup"
        position="bottom center"
        style={{ lineHeight: '22px', padding: '1rem' }}
        trigger={<span style={elemStyle} >
          <FormattedBlock
            benefits={benefits}
            newStyle={null}
            item={item}
            carrierName={carrierName}
            motionLink={motionLink}
          />
        </span>}
        content={
          <FormattedBlock
            newStyle={null}
            benefits={benefits}
            item={item}
            carrierName={carrierName}
            motionLink={motionLink}
          />
        }
        hoverable={hoverable}
        wide
      />
    );
  }
}

function FormattedBlock(props) {
  const { benefits, item, carrierName, motionLink, newStyle } = props;
  let motion = false;
  if (benefits && benefits === 'in') {
    if (item.discountTypeIn === DISCOUNT_MOTION) motion = true;
    return (
      <FormatedItem
        benefits={benefits}
        value={item.valueIn}
        type={item.typeIn}
        name={item.name}
        item={item}
        motion={motion}
        carrierName={carrierName}
        motionLink={motionLink}
        newStyle={newStyle}
      />
    );
  } else if (benefits && benefits === 'out') {
    if (item.discountTypeOut === DISCOUNT_MOTION) motion = true;
    return (
      <FormatedItem
        benefits={benefits}
        value={item.valueOut}
        type={item.typeOut}
        name={item.name}
        item={item}
        motion={motion}
        carrierName={carrierName}
        motionLink={motionLink}
        newStyle={newStyle}
      />
    );
  }

  if (item.discountType === DISCOUNT_MOTION) motion = true;

  return (
    <FormatedItem
      benefits={benefits}
      value={item.value}
      type={item.type}
      name={item.name}
      item={item}
      motion={motion}
      carrierName={carrierName}
      motionLink={motionLink}
      newStyle={newStyle}
    />
  );
}

function FormatedItem(props) {
  const { value, type, name, motion, carrierName, motionLink, item, benefits, newStyle } = props;
  const newValue = (type === 'DOLLAR' || type === 'PERCENT') ? extractFloat(value)[0] : value;
  const style = newStyle || {
    fontSize: 13,
    fontWeight: 600,
    display: 'block',
    heigth: 15,
    wordWrap: 'break-word',
  };
  const motionStyle = {
    fontSize: 13,
    fontWeight: 600,
    display: 'block',
    height: 24,
    overflow: 'hidden',
  };

  if (type === 'DOLLAR') {
    return (
      <span style={motion ? motionStyle : style}>
        { !motion && <FormattedNumber
          style="currency" // eslint-disable-line react/style-prop-object
          currency="USD"
          minimumFractionDigits={2}
          maximumFractionDigits={2}
          value={newValue}
        /> }
        { motion && <Motion
          data={item}
          benefits={benefits}
          carrierName={carrierName}
          motionLink={motionLink}
          value={<FormattedNumber
            data={item}
            style="currency" // eslint-disable-line react/style-prop-object
            currency="USD"
            minimumFractionDigits={2}
            maximumFractionDigits={2}
            value={newValue}
          />}
        /> }
      </span>
    );
  } else if (type === 'PERCENT' && value !== 'N/A') {
    if (name === '% change from current') {
      return (
        <span style={motion ? motionStyle : style}>
          { !motion && <FormattedNumber
            style="percent" // eslint-disable-line react/style-prop-object
            minimumFractionDigits={0}
            maximumFractionDigits={1}
            value={newValue / 100}
          /> }
          { motion && <Motion
            data={item}
            benefits={benefits}
            carrierName={carrierName}
            motionLink={motionLink}
            value={<FormattedNumber
              style="percent" // eslint-disable-line react/style-prop-object
              minimumFractionDigits={0}
              maximumFractionDigits={1}
              value={newValue / 100}
            />}
          />}
        </span>
      );
    }
    return (
      <span style={motion ? motionStyle : style}>
        { !motion && <FormattedNumber
          style="percent" // eslint-disable-line react/style-prop-object
          minimumFractionDigits={0}
          maximumFractionDigits={1}
          value={newValue / 100}
        /> }
        { motion && <Motion
          data={item}
          benefits={benefits}
          carrierName={carrierName}
          motionLink={motionLink}
          value={<FormattedNumber
            style="percent" // eslint-disable-line react/style-prop-object
            minimumFractionDigits={0}
            maximumFractionDigits={1}
            value={newValue / 100}
          />}
        />}
      </span>
    );
  }
  return (
    <span style={motion ? motionStyle : style}>
      {!motion && value}
      { motion && <Motion
        data={item}
        benefits={benefits}
        carrierName={carrierName}
        motionLink={motionLink}
        value={<span>{value}</span>}
      />}
    </span>
  );
}
export default ItemValueTypedBenefits;

import React from 'react';import PropTypes from 'prop-types';import { FormattedNumber } from 'react-intl';import { extractFloat } from '@benrevo/benrevo-react-core';class ItemValueTyped extends React.Component { // eslint-disable-line react/prefer-stateless-function  static propTypes = {    item: PropTypes.object.isRequired,  };  render() {    const { item } = this.props;    return (      <FormatedItem        value={item.value}        type={item.type}        name={item.name}      />    );  }}function FormatedItem(props) {  const { value, type, name } = props;  const newValue = (type === 'DOLLAR' || type === 'PERCENT') ? extractFloat(value)[0] : value;  const style = {    fontSize: 13,    fontWeight: 600,    display: 'block',    height: 24,    lineHeight: '24px',    textOverflow: 'ellipsis',    overflow: 'hidden',  };  if (type === 'DOLLAR') {    return (      <span style={style}>        <FormattedNumber          style="currency" // eslint-disable-line react/style-prop-object          currency="USD"          minimumFractionDigits={2}          maximumFractionDigits={2}          value={newValue}        />      </span>    );  } else if (type === 'PERCENT' && value !== 'N/A') {    if (name === '% change from current') {      return (        <span style={style}>          <FormattedNumber            style="percent" // eslint-disable-line react/style-prop-object            minimumFractionDigits={0}            maximumFractionDigits={1}            value={newValue / 100}          />        </span>      );    }    return (      <span style={style}>        <FormattedNumber          style="percent" // eslint-disable-line react/style-prop-object          minimumFractionDigits={0}          maximumFractionDigits={1}          value={newValue / 100}        />      </span>    );  }  return (    <span style={style}>      {value}    </span>  );}export default ItemValueTyped;
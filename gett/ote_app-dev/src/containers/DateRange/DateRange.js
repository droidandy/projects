import { connect } from 'react-redux';
import { compact } from 'lodash';

import { setFilter } from 'actions/orders';

import BaseDateRange from './BaseDateRange';

const mapStateToProps = ({ orders }) => ({
  initialValue: compact([orders.meta.from, orders.meta.to]),
  value: compact(orders.tempMeta.rangeValue)
});

const onChange = value => setFilter('meta', value);
const onRangeChange = value => setFilter('tempMeta.rangeValue', value);

export default connect(mapStateToProps, { onChange, onRangeChange })(BaseDateRange);

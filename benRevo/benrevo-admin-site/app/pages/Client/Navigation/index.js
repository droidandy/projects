import { connect } from 'react-redux';
import Navigation from './Navigation';

function mapStateToProps(state) {
  const overviewState = state.get('base');
  return {
    selectedCarrier: overviewState.get('selectedCarrier').toJS(),
  };
}

export default connect(mapStateToProps, null)(Navigation);

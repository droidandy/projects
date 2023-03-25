import { connect } from 'react-redux';
import Sales from './Sales';
import { getPersons } from './actions';

function mapStateToProps() {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPersons: () => { dispatch(getPersons()); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sales);

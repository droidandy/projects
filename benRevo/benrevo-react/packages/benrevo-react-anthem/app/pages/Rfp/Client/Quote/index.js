import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Quote from './Quote';

function mapStateToProps(state, ownProps) {
  const section = ownProps.routes[2].path;
  const clientRfp = state.get('rfp').get(section);
  const clientsState = state.get('clients');

  return {
    formErrors: clientRfp.get('formErrors').toJS(),
    products: clientsState.get('current').get('products').toJS(),
    virginCoverage: clientsState.get('current').get('virginCoverage').toJS(),
    section,
  };
}


function mapDispatchToProps(dispatch) {
  return {
    changePage: (prev) => {
      dispatch(push(`/rfp/${prev}`));
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Quote);

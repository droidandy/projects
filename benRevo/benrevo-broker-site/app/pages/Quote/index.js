import { connect } from 'react-redux';
import { changeLoadReset } from '@benrevo/benrevo-react-quote';
import Presentation from './Presentation';

function mapStateToProps(state, ownProps) {
  const section = ownProps.routes[4].path;
  const { clientId } = ownProps.params;
  const clientsState = state.get('clients');

  return {
    clientId,
    section,
    products: clientsState.get('current').get('products').toJS(),
    client: clientsState.get('current').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeLoadReset: () => { dispatch(changeLoadReset()); },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Presentation);

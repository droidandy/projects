import { connect } from 'react-redux';
import {
  selectSectionTitle,
  updateAttribute,
} from '@benrevo/benrevo-react-rfp';
import { updateClient } from '@benrevo/benrevo-react-clients';
import ProductUW from './ProductUW';

function mapStateToProps(state, ownProps) {
  const section = ownProps.routes[4].path;
  const infoState = state.get('rfp').get(section);
  const clientsState = state.get('clients');

  return {
    section,
    title: selectSectionTitle(section),
    client: clientsState.get('current').toJS(),
    attributes: infoState.get('attributes').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateAttribute: (section, attribute, value) => { dispatch(updateAttribute(section, attribute, value)); },
    updateClient: (name, value) => { dispatch(updateClient(name, value)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductUW);

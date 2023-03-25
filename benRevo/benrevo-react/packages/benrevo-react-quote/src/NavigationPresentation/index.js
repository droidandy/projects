import { connect } from 'react-redux';
import NavigationPresentation from './NavigationPresentation';
import { changeCurrentPage } from '../actions';


function mapDispatchToProps(dispatch) {
  return {
    changeCurrentPage: (section, page) => { dispatch(changeCurrentPage(section, page)); },
  };
}

export default connect(null, mapDispatchToProps)(NavigationPresentation);

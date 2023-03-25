import { connect } from 'react-redux';
import { changeCurrentPage } from '@benrevo/benrevo-react-quote';
import NavigationPresentation from './NavigationPresentation';


function mapDispatchToProps(dispatch) {
  return {
    changeCurrentPage: (section, page) => { dispatch(changeCurrentPage(section, page)); },
  };
}

export default connect(null, mapDispatchToProps)(NavigationPresentation);

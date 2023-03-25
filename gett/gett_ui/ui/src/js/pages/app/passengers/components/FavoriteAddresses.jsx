import { connect } from 'react-redux';
import dispatchers from 'js/redux/app/passengers.dispatchers';
import FavoriteAddresses from 'pages/shared/passengers/components/FavoriteAddresses';

function mapStateToProps(state) {
  return { favoriteAddresses: state.passengers.formData.favoriteAddresses };
}

export default connect(mapStateToProps, dispatchers.mapToProps)(FavoriteAddresses);

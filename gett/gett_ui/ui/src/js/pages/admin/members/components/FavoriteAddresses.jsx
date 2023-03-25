import { connect } from 'react-redux';
import dispatchers from 'js/redux/admin/members.dispatchers';
import FavoriteAddresses from 'pages/shared/passengers/components/FavoriteAddresses';

function mapStateToProps(state) {
  return { favoriteAddresses: state.members.formData.favoriteAddresses };
}

export default connect(mapStateToProps, dispatchers.mapToProps)(FavoriteAddresses);

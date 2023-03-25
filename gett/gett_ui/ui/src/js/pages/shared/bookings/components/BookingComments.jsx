import { connect } from 'react-redux';
import CommentsPopup from 'pages/shared/comments/CommentsPopup';

function mapStateToProps(state) {
  return { comments: state.bookings.comments };
}

// since file is shared, dispatchers are passed from parent component.
// only redux state connection is reused.
export default connect(mapStateToProps)(CommentsPopup);

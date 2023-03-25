import { connect } from 'react-redux';
import CommentsPopup from 'pages/shared/comments/CommentsPopup';
import dispatchers from 'js/redux/admin/members.dispatchers';

function mapStateToProps(state) {
  return { comments: state.members.comments };
}

function mapDispatchToProps(dispatch, ownProps) {
  const props = dispatchers(dispatch, ['getComments', 'addComment']);

  return {
    onShow: props.getComments.bind(null, ownProps.memberId),
    onAdd: props.addComment.bind(null, ownProps.memberId)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentsPopup);

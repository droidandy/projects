import { connect } from 'react-redux';
import CommentsPopup from 'pages/shared/comments/CommentsPopup';
import dispatchers from 'js/redux/admin/companies.dispatchers';

function mapStateToProps(state) {
  return { comments: state.companies.comments };
}

function mapDispatchToProps(dispatch, ownProps) {
  const props = dispatchers(dispatch, ['getComments', 'addComment']);

  return {
    onShow: props.getComments.bind(null, ownProps.companyId),
    onAdd: props.addComment.bind(null, ownProps.companyId)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentsPopup);

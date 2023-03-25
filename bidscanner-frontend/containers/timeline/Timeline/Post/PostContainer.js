import { reduxForm } from 'redux-form';

import Post from 'components/timeline/Timeline/Post/Post';

export default reduxForm({
  form: 'post',
})(Post);

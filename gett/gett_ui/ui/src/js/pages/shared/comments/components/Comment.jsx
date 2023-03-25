import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'components';
import moment from 'moment';

export default function Comment({ comment }) {
  const { createdAt, text, author: { fullName, avatarUrl } } = comment;

  return (
    <div className="layout horizontal mb-20 mr-5" data-name="comment">
      <div >
        <Avatar src={ avatarUrl } name={ fullName } className="mb-10" size={ 40 } />
      </div>
      <div className="ml-10 flex">
        <div data-name="commentAuthor">{ fullName }</div>
        <pre data-name="commentText">{ text }</pre>
      </div>
      <span className="ml-10 self-start text-10">{ moment(createdAt).format('DD/MM/YYYY - HH:mm') }</span>
    </div>
  );
}

Comment.propTypes = {
  comment: PropTypes.shape({
    data: PropTypes.object,
    createdAt: PropTypes.string,
    text: PropTypes.string,
    author: PropTypes.object
  }).isRequired
};

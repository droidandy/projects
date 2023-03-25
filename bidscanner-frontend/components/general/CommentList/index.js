// @flow
import React from 'react';

import Comment, { type CommentProps } from 'components/general/CommentList/Comment';

export type CommentListProps = {
  comments: CommentProps[],
};

export default ({ comments }: CommentListProps) =>
  <div className="mt-3">
    {comments.map(({ username, message }, index) =>
      <Comment key={`comment-${index}`} username={username} message={message} />
    )}
  </div>;

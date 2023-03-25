import * as R from 'remeda';
import React from 'react';
import Skeleton from 'react-skeleton-loader';
import { WriteComment } from './WriteComment';
import { NoComments } from './NoComments';
import styled from 'styled-components';
import { CommentItem } from './CommentItem';
import { AttachedFiles } from '../../../components/AttachedFiles';
import { getCommentsState } from '../interface';

const SkeletonWrapper = styled.div`
  padding: 30px;
`;

const Comments = styled.div`
  flex: 1 0 0;
  overflow: auto;
`;

export interface MainCommentsContentProps {
  setIsExpanded: (isExpanded: boolean) => void;
}

export function MainCommentsContent(props: MainCommentsContentProps) {
  const { comments, isLoading } = getCommentsState.useState();
  const { setIsExpanded } = props;

  const sortedComments = React.useMemo(() => {
    return [...comments].sort(
      (a, b) =>
        new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
    );
  }, [comments]);
  const files = React.useMemo(() => {
    return R.pipe(
      comments,
      R.flatMap(x => x.files || []),
      R.filter(x => !!x.document),
      R.map(x => x.document)
    );
  }, [comments]);

  return isLoading ? (
    <SkeletonWrapper>
      <Skeleton height={'13px'} count={10} width="80%" />
    </SkeletonWrapper>
  ) : (
    <>
      <AttachedFiles files={files} />
      {sortedComments.length ? (
        <Comments>
          {sortedComments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </Comments>
      ) : (
        <NoComments />
      )}
      <WriteComment onExpanded={setIsExpanded} />
    </>
  );
}

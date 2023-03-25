import * as React from 'react';
import styled from 'styled-components';
import { BaseComment } from 'src/types-next';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { formatDate } from 'src/common/utils';

interface ReportCommentProps {
  className?: string;
  comment: BaseComment;
}

const Author = styled.strong``;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Text = styled.div`
  white-space: pre;
`;

const _ReportComment = (props: ReportCommentProps) => {
  const { className, comment } = props;
  return (
    <div className={className}>
      <Top>
        <Author>
          <DisplayTransString value={comment.addedByUser.user.name} />
        </Author>
        <div>{formatDate(comment.addedDate, true)}</div>
      </Top>
      <Text>{comment.text}</Text>
    </div>
  );
};

export const ReportComment = styled(_ReportComment)`
  display: block;
  border: 1px solid #ebedf2;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
`;

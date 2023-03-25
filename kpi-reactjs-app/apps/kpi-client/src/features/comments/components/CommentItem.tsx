import * as React from 'react';
import * as DateFns from 'date-fns';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/Button';
import { CheckIcon } from 'src/icons/CheckIcon';
import { CancelIcon } from 'src/icons/CancelIcon';
import { CommentWithState, CommentsActions } from '../interface';
import { useActions } from 'typeless';
import { ClockIcon } from 'src/icons/ClockIcon';
import { AttachedFile } from '../../../components/AttachedFile';

interface CommentItemProps {
  className?: string;
  comment: CommentWithState;
}

const Col1 = styled.div`
  margin-left: 15px;
`;
const Col2 = styled.div`
  flex: 1 0 0;
`;

const Avatar = styled.div`
  border-radius: 3px;
  width: 30px;
  height: 30px;
  background: #dcdcdc;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Name = styled.div`
  font-weight: bold;
  color: #244159;
`;
const Text = styled.div`
  color: #a7abc3;
`;

const DateLabel = styled.div`
  font-size: 13px;
  color: #a7abc3;
  font-weight: bold;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;

  ${Button} + ${Button} {
    margin-right: 10px;
  }
  svg {
    margin-left: 3px;
  }
`;

const TagRow = styled.div`
  display: flex;
`;

const Tag = styled.div`
  font-size: 12px;
  background: #d8ffcf;
  border-radius: 3px;
  color: #5a9550;
  padding: 3px 8px;
`;

function _isOpen(comment: CommentWithState) {
  return comment.status === 'Open' || comment.status === 'None';
}

const _CommentItem = (props: CommentItemProps) => {
  const { className, comment } = props;
  const { t } = useTranslation();
  const { makeCommentAction } = useActions(CommentsActions);

  const formatDate = (date: string) => {
    const now = new Date();
    const text = DateFns.formatDistanceStrict(new Date(date), now);
    return text + ' ' + t('ago');
  };

  const renderButtons = () => {
    if (comment.type !== 'ToDo') {
      return null;
    }
    if (_isOpen(comment)) {
      return (
        <Actions>
          <>
            <Button
              styling="danger"
              loading={comment.isLoading === 'cancel'}
              onClick={() => makeCommentAction(comment, 'cancel')}
            >
              <CancelIcon /> {t('Cancel')}
            </Button>
            <Button
              loading={comment.isLoading === 'resolve'}
              onClick={() => makeCommentAction(comment, 'resolve')}
            >
              <CheckIcon /> {t('Resolve')}
            </Button>
          </>
        </Actions>
      );
    } else {
      return (
        <Actions>
          <Button
            loading={comment.isLoading === 'reopen'}
            onClick={() => makeCommentAction(comment, 'reopen')}
          >
            <ClockIcon /> {t('Reopen')}
          </Button>
        </Actions>
      );
    }
  };

  const renderComments = () => {
    if (!comment.files.length) {
      return;
    }
    return (
      <div>
        {comment.files
          .filter(item => item.document)
          .map(item => (
            <AttachedFile key={item.document.id} file={item.document} />
          ))}
      </div>
    );
  };

  return (
    <div className={className}>
      <Col1>
        <Avatar />
      </Col1>
      <Col2>
        {comment.status === 'Resolved' && comment.type === 'ToDo' && (
          <TagRow>
            <Tag>{t('Resolved')}</Tag>
          </TagRow>
        )}
        <Top>
          <Name>{comment.addedByUser.user?.username}</Name>
          <DateLabel>{formatDate(comment.addedDate)}</DateLabel>
        </Top>
        <Text dangerouslySetInnerHTML={{ __html: comment.text }} />
        {renderButtons()}
        {renderComments()}
      </Col2>
    </div>
  );
};

export const CommentItem = styled(_CommentItem)`
  display: flex;
  padding: 15px 30px;
  ${props =>
    _isOpen(props.comment) &&
    props.comment.type === 'ToDo' &&
    css`
      background: #f7f9fc;
    `}
`;

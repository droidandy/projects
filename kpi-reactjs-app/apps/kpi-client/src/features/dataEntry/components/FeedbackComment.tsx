import * as React from 'react';
import styled from 'styled-components';
import { OrganizationUnitUser, UnitReportComment } from 'src/types';
import { useTranslation } from 'react-i18next';

interface FeedbackCommentProps {
  className?: string;
  unitUser: OrganizationUnitUser;
  comment: UnitReportComment;
}

const Top = styled.div`
  display: flex;
  align-items: center;
`;

const Name = styled.div`
  font-weight: bold;
  color: #244159;
  margin-right: 8px;
`;
const Avatar = styled.div`
  border-radius: 3px;
  width: 30px;
  height: 30px;
  background: #dcdcdc;
`;

const Label = styled.div`
  font-weight: bold;
  color: #a7abc3;
  margin-top: 9px;
  margin-bottom: 5px;
`;

const Text = styled.div`
  color: #a7abc3;
`;

const _FeedbackComment = (props: FeedbackCommentProps) => {
  const { className, comment, unitUser } = props;
  const { t } = useTranslation();
  return (
    <div className={className}>
      <Top>
        <Avatar />
        <Name>{unitUser.orgUser.user.username}</Name>
      </Top>
      <Label>{t('Reviewer Feedback / Notes')}:</Label>
      <Text dangerouslySetInnerHTML={{ __html: comment.text }} />
    </div>
  );
};

export const FeedbackComment = styled(_FeedbackComment)`
  display: block;
  border-top: 1px solid #e7ebf0;
  padding: 10px 0;
`;

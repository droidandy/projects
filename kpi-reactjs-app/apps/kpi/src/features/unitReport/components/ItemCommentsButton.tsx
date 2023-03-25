import styled from 'styled-components';
import { Button } from 'src/components/Button';
import React from 'react';
import { BaseComment, UnitReportType } from 'src/types-next';
import { ReportCommentsActions } from './ReportCommentsModal';
import { useActions } from 'typeless';
import { useTranslation } from 'react-i18next';

interface ItemCommentsButtonProps {
  type: UnitReportType;
  unitReportId: number;
  itemId: number;
  comments: BaseComment[];
}

const AddComment = styled.div`
  ${Button} {
    width: 20px;
    height: 20px;
    padding: 0;
    i {
      font-size: 1rem;
      margin: 0;
    }
  }
`;

export function ItemCommentsButton(props: ItemCommentsButtonProps) {
  const { type, comments, itemId, unitReportId } = props;
  const { show: showComments } = useActions(ReportCommentsActions);
  const { t } = useTranslation();

  const show = () => showComments(type, unitReportId, itemId, comments);

  if (comments.length) {
    return (
      <AddComment>
        {comments.length} <i className="flaticon-comment" />
        {' | '}
        <Button small iconSize="lg" onClick={show}>
          <i className="flaticon2-plus" />
        </Button>
      </AddComment>
    );
  } else {
    return (
      <Button small onClick={show}>
        {t('add')}
      </Button>
    );
  }
}

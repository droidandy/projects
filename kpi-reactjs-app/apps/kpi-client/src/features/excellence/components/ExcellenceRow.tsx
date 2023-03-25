import React from 'react';
import { DisplayTransString } from 'src/components/DisplayTransString';
import styled from 'styled-components';
import { formatDate } from 'src/common/utils';
import { useActions } from 'typeless';
import { CommentsActions } from 'src/features/comments/interface';
import { AttachmentsActions } from 'src/features/attachments/interface';
import { FileIcon } from 'src/components/FileIcon';
import { CommentIcon } from 'src/components/CommentIcon';
import { CalcExcellence, CalcStatusExcellence } from 'src/types';
import { TableRow } from './TableRow';
import { useTranslation } from 'react-i18next';
import { Caret } from 'src/components/Caret';
import { ExcellenceRowDetails } from './ExcellenceRowDetails';

interface ExcellenceRowProps {
  item: CalcExcellence;
  className?: string;
}

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icons = styled(Center)`
  a {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  svg {
    margin: 0 5px;
  }
`;

const Status = styled.div`
  border-radius: 3px;
  width: 100%;
  width: 90px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

function _getColor(status: CalcStatusExcellence) {
  switch (status) {
    case 'Completed':
      return '#8EC684';
    case 'Active':
      return '#FEAD33';
    default:
      return '#FF3766';
  }
}

const NameCell = styled.div`
  display: flex;
  align-items: center;
`;

const IdCell = styled.div`
  display: flex;
  align-items: center;
  ${Caret} {
    margin-left: 10px;
  }
`;

const _ExcellenceRow = (props: ExcellenceRowProps) => {
  const { item, className } = props;
  const { show: showComments } = useActions(CommentsActions);
  const { show: showAttachments } = useActions(AttachmentsActions);
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = React.useState(false);
  return (
    <>
      <TableRow
        className={className}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Id */}
        <IdCell>
          <Caret direction={isExpanded ? 'down' : 'left'} />
          <strong>{item.id}</strong>
        </IdCell>
        {/* Name */}
        <NameCell>
          <strong>
            <DisplayTransString value={item.name} />
          </strong>
        </NameCell>
        {/* Status */}
        <div style={{display: 'flex', placeContent: 'center'}}>
          <Status
            style={{
              background: _getColor(item.calcStatus),
            }}
          >
            {t(item.calcStatus === 'NotExist' ? 'Not Exist' : item.calcStatus)}
          </Status>
        </div>
        {/* Start Date */}
        <Center>{item.startDate ? formatDate(item.startDate) : '-'}</Center>
        {/* End Date */}
        <Center>{item.endDate ? formatDate(item.endDate) : '-'}</Center>
        {/* Evidences */}
        <Icons>
          <a
            onClick={e => {
              e.preventDefault();
              showAttachments(item, {
                excellenceRequirementId: item.id,
              });
            }}
          >
            <FileIcon />
          </a>
          <a
            onClick={e => {
              e.preventDefault();
              showComments(item, {
                excellenceRequirementId: item.id,
              });
            }}
          >
            <CommentIcon />
          </a>
        </Icons>
      </TableRow>
      {isExpanded && <ExcellenceRowDetails item={item} />}
    </>
  );
};

export const ExcellenceRow = styled(_ExcellenceRow)`
  border-bottom: 1px solid #f2f3f8;
  cursor: pointer;
`;

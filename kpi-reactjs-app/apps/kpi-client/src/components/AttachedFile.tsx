import * as React from 'react';
import styled from 'styled-components';
import { FileDocument } from 'src/types';
import { AttachmentIcon } from '../icons/AttachmentIcon';
import { GlobalActions } from 'src/features/global/interface';
import { useTranslation } from 'react-i18next';
import { useActions } from 'typeless';
import * as DateFns from 'date-fns';

interface AttachedFileProps {
  className?: string;
  file: FileDocument;
  withDate?: boolean;
}

const DateLabel = styled.div`
  font-size: 13px;
  color: #a7abc3;
`;

const _AttachedFile = (props: AttachedFileProps) => {
  const { className, file, withDate } = props;
  const { t } = useTranslation();
  const { downloadFile } = useActions(GlobalActions);

  const formatDate = (date: string) => {
    const now = new Date();
    const text = DateFns.formatDistanceStrict(new Date(date), now);
    return text + ' ' + t('ago');
  };

  return (
    <div className={className}>
      <a onClick={() => downloadFile(file.id)}>
        <AttachmentIcon />
        {file.fileName}
      </a>
      {withDate && <DateLabel>{formatDate(file.addedDate)}</DateLabel>}
    </div>
  );
};

export const AttachedFile = styled(_AttachedFile)`
  display: flex;
  justify-content: space-between;
  svg {
    margin-left: 7px;
  }
  a {
    color: #10a6e9;
    font-weight: 600;
    display: flex;
    align-items: center;
  }
`;

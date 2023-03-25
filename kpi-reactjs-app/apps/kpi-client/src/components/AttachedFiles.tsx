import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FileDocument } from 'src/types';
import { AttachedFile } from './AttachedFile';

interface AttachedFilesProps {
  className?: string;
  files: FileDocument[];
  withDate?: boolean;
}

const Title = styled.div`
  font-weight: bold;
  font-size: 12px;
  color: #a7abc3;
  text-transform: uppercase;
  padding-right: 30px;
`;

const Scroll = styled.div``;

const _AttachedFiles = (props: AttachedFilesProps) => {
  const { className, files, withDate } = props;
  const { t } = useTranslation();

  const sortedFiles = React.useMemo(() => {
    return [...files].sort(
      (a, b) =>
        new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
    );
  }, [files]);

  return (
    <div className={className}>
      <Title>{t('ATTACHED FILES')}</Title>
      <Scroll>
        {sortedFiles.map(item => (
          <AttachedFile key={item.id} file={item} withDate={withDate} />
        ))}
      </Scroll>
    </div>
  );
};

export const AttachedFiles = styled(_AttachedFiles)`
  display: block;
  margin-top: 15px;
  ${AttachedFile} {
    padding: 8px 30px;
  }
`;

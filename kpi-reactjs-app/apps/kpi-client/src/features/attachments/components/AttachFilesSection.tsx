import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/Button';
import { getAttachmentsState, AttachmentsActions } from '../interface';
import { useActions } from 'typeless';

interface AttachFilesSectionProps {
  className?: string;
}

const Label = styled.div`
  font-weight: bold;
`;
const Col1 = styled.div`
  white-space: pre;
  height: 37px;
  padding-left: 20px;
  display: flex;
  align-items: center;
`;
const Col2 = styled.div``;
const Info = styled.div`
  font-size: 12px;
  color: #a7abc3;
`;

const _AttachFilesSection = (props: AttachFilesSectionProps) => {
  const { className } = props;
  const { t } = useTranslation();
  const fileRef = React.useRef(null! as HTMLInputElement);
  const { uploadFiles } = useActions(AttachmentsActions);
  const { isSubmitting } = getAttachmentsState.useState();
  return (
    <div className={className}>
      <input
        type="file"
        ref={fileRef}
        max={5}
        multiple
        onChange={e => {
          if (!e.target.files) {
            return;
          }
          const files = Array.prototype.slice.call(e.target.files, 0);
          uploadFiles(files);
        }}
      />
      <Col1>
        <Label>{t('Add new Files')}</Label>
      </Col1>
      <Col2>
        <Button
          loading={isSubmitting}
          styling="brand"
          onClick={() => {
            fileRef.current.click();
          }}
        >
          {t('Attach files')}
        </Button>
        <Info>{t('Max file size is 1MB And max number of files is 5')}</Info>
      </Col2>
    </div>
  );
};

export const AttachFilesSection = styled(_AttachFilesSection)`
  display: flex;
  border-top: 1px solid #e8eaf0;
  margin-top: auto;
  padding: 30px 30px 30px 40px;
  input[type='file'] {
    display: none;
  }
`;

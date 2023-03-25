import React from 'react';
import { Evidence } from 'src/types-next';
import styled from 'styled-components';
import { Button } from 'src/components/Button';
import { useTranslation } from 'react-i18next';

export interface EvidencesProps {
  evidences: Evidence[];
  upload: (file: File) => any;
}

const AddEvidence = styled.div`
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
const FileList = styled.div`
  a {
    display: block;
  }
`;

export function Evidences(props: EvidencesProps) {
  const { evidences, upload } = props;
  const fileRef = React.useRef(null as HTMLInputElement | null);
  const [inputKey, setInputKey] = React.useState(1);
  const { t } = useTranslation();

  const renderContent = () => {
    const onClick = () => {
      fileRef.current!.click();
    };
    if (evidences.length) {
      return (
        <AddEvidence>
          {evidences.length} <i className="flaticon-file-2" />
          {' | '}
          <Button small iconSize="lg" onClick={onClick}>
            <i className="flaticon-upload" />
          </Button>
          <FileList>
            {evidences.map(item => (
              <a key={item.id} href="javascript:">
                {item.document.fileName}
              </a>
            ))}
          </FileList>
        </AddEvidence>
      );
    } else {
      return (
        <Button small onClick={onClick}>
          {t('upload')}
        </Button>
      );
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileRef}
        accept=".png,.svg"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files![0];
          if (file) {
            upload(file);
          }
          setInputKey(inputKey + 1);
        }}
        style={{ display: 'none' }}
        key={inputKey}
      />
      {renderContent()}
    </>
  );
}

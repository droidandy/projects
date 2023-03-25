import React from 'react';
import styled from 'styled-components';
import { AttachmentIcon } from '../../../icons/AttachmentIcon';
import { CancelIcon } from 'src/icons/CancelIcon';

interface WriteEditorAttachmentProps {
  onSelected(file: File | null): void;
  file: File | null;
}

const AttachmentIconButton = styled.a`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: #ffffff;
    box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.15);
  }
`;

const Wrapper = styled.div`
  position: absolute;
  left: 8px;
  bottom: 20px;
`;

const Name = styled.div`
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre;
  margin-left: 5px;
  margin-right: 5px;
`;

const SelectedFile = styled.div`
  display: flex;
  color: #10a6e9;
  align-items: center;
`;

export function WriteEditorAttachment(props: WriteEditorAttachmentProps) {
  const { onSelected, file } = props;
  const [fileKey, setFileKey] = React.useState(1);
  const fileRef = React.useRef(null! as HTMLInputElement);
  return (
    <Wrapper>
      <input
        ref={fileRef}
        key={fileKey}
        type="file"
        style={{ display: 'none' }}
        onChange={e => {
          const files = e.target.files;
          if (files) {
            onSelected(files[0] || null);
            setFileKey(fileKey + 1);
          }
        }}
      />
      {file ? (
        <SelectedFile>
          <AttachmentIcon />
          <Name>{file.name}</Name>
          <a
            onClick={e => {
              e.stopPropagation();
              onSelected(null);
            }}
          >
            <CancelIcon color="#A7ABC3" />
          </a>
        </SelectedFile>
      ) : (
        <AttachmentIconButton
          onClick={() => {
            fileRef.current.click();
          }}
        >
          <AttachmentIcon />
        </AttachmentIconButton>
      )}
    </Wrapper>
  );
}

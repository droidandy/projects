import * as React from 'react';
import styled from 'styled-components';
import { NoAttachmentsImage } from './NoAttachmentsImage';
import { useTranslation } from 'react-i18next';

interface NoAttachmentsProps {
  className?: string;
}

const Text = styled.div`
  text-align: center;
  color: #c7d0d9;
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 20px;
  padding: 0 50px;
`;

const _NoAttachments = (props: NoAttachmentsProps) => {
  const { className } = props;
  const { t } = useTranslation();
  return (
    <div className={className}>
      <Text>{t('No Attachment Available Right Now')}</Text>
      <NoAttachmentsImage />
    </div>
  );
};

export const NoAttachments = styled(_NoAttachments)`
  display: block;
  margin-top: auto;
  margin-bottom: auto;
  svg {
    display: block;
    margin: 0 auto;
  }
`;

import * as React from 'react';
import styled from 'styled-components';
import { NoCommentsImage } from './NoCommentsImage';
import { useTranslation } from 'react-i18next';

interface NoCommentsProps {
  className?: string;
}

const Line1 = styled.div`
  text-align: center;

  color: #c7d0d9;
`;
const Line2 = styled.div`
  text-align: center;
  color: #10a6e9;
  font-size: 24px;
  margin-bottom: 20px;
`;

const _NoComments = (props: NoCommentsProps) => {
  const { className } = props;
  const { t } = useTranslation();
  return (
    <div className={className}>
      <Line1>{t('No Comments Found')}</Line1>
      <Line2>{t('Start Discussion')}</Line2>
      <NoCommentsImage />
    </div>
  );
};

export const NoComments = styled(_NoComments)`
  display: block;
  margin-top: auto;
  margin-bottom: auto;
`;

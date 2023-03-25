import React from 'react';
import { Badge } from './Badge';
import styled from 'styled-components';
import { Portlet } from './Portlet';
import { User } from 'src/types';
import { useLanguage } from 'src/hooks/useLanguage';
import { formatDate } from 'src/common/utils';
import { TwoLayoutCol } from './TwoLayoutCol';
import { useTranslation } from 'react-i18next';

const Badges = styled.div`
  ${Badge} + ${Badge} {
    margin-left: 10px;
  }
`;

const LastUpdated = styled.div`
  color: #666;
  font-style: italic;
  font-size: 0.9rem;
  margin-top: 10px;
`;

const Top = styled.div`
  display: flex;
`;

interface DetailsProps {
  title: React.ReactNode;
  toolbarButtons?: React.ReactNode;
  badges?: React.ReactNode;
  col1: React.ReactNode;
  col2: React.ReactNode;
  lastUpdatedTime: string;
  lastUpdatedBy: User;
}

export function Details(props: DetailsProps) {
  const {
    title,
    toolbarButtons,
    badges,
    col1,
    col2,
    lastUpdatedTime,
    lastUpdatedBy,
  } = props;
  const lang = useLanguage();
  const { t } = useTranslation();

  return (
    <Portlet padding>
      <Top>
        <h2>{title}</h2>
        {toolbarButtons}
      </Top>
      <Badges>{badges}</Badges>
      <LastUpdated>
        {t('Last Updated')} {formatDate(lastUpdatedTime)}, {t('by')}{' '}
        {lastUpdatedBy.name[lang]}
      </LastUpdated>
      <TwoLayoutCol col1={col1} col2={col2} />
    </Portlet>
  );
}

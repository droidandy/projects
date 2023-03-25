import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface EmptyOrgUsersProps {
  className?: string;
}

const _EmptyOrgUsers = (props: EmptyOrgUsersProps) => {
  const { className } = props;
  const { t } = useTranslation();
  return (
    <div className={className}>
      <p>{t('This Unit has no users.')}</p>
    </div>
  );
};

export const EmptyOrgUsers = styled(_EmptyOrgUsers)`
  display: flex;
  height: 100%;
  margin: 10px 0;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: white;
  text-align: center;
`;

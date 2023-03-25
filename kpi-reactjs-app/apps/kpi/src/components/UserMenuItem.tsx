import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { getGlobalState } from 'src/features/global/interface';

interface UserMenuItemProps {
  className?: string;
}

const Hi = styled.div`
  transition: all 0.3s;
  color: #959cb6;
  align-self: center;
`;

const Username = styled.div`
  transition: all 0.3s;
  color: #6c7293;
  align-self: center;
  padding-left: 5px;
  padding-right: 5px;
  font-weight: 500;
`;

const Badge = styled.div`
  height: 35px;
  width: 35px;
  font-size: 16px;
  font-weight: 600;
  color: #0abb87;
  background: rgba(10, 187, 135, 0.1);
  border-radius: 4px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

const _UserMenuItem = (props: UserMenuItemProps) => {
  const { className } = props;
  const { t } = useTranslation();
  const { user } = getGlobalState.useState();
  if (!user) {
    return null;
  }
  return (
    <div className={className}>
      <Hi>{t('hi')}</Hi>
      <Username>{user.username}</Username>
      <Badge>{user.username[0].toUpperCase()}</Badge>
    </div>
  );
};

export const UserMenuItem = styled(_UserMenuItem)`
  display: flex;
`;

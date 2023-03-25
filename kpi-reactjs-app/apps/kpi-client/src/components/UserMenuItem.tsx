import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { getGlobalState } from 'src/features/global/interface';

interface UserMenuItemProps {
  className?: string;
}

const Hi = styled.div`
  transition: all 0.3s;
  color: white;
  align-self: center;
  font-size: 1rem;
`;

const Username = styled.div`
  transition: all 0.3s;
  color: white;
  align-self: center;
  padding-left: 5px;
  padding-right: 5px;
  font-weight: 500;
  font-size: 1rem;
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
      <Username>{user.username}!</Username>
      <img src={require('../../assets/mocks/avatar.png')} />
    </div>
  );
};

export const UserMenuItem = styled(_UserMenuItem)`
  display: flex;
  align-items: center;
  &:hover {
    cursor: pointer;
  }

  img {
    align-self: center;
    height: 42px;
    border-radius: 50%;
  }
`;

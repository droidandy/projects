import React, { FC } from 'react';
import { Title } from 'containers/PersonalArea/components';
import Breadcrumbs from 'components/Breadcrumbs';
import { useStyles } from './Hero.styles';

export const Hero: FC = () => {
  const { breadcrumbsWrapper } = useStyles();
  const breadcrumbs = [{ to: '/', label: 'Главная' }, { to: '/profile', label: 'Мой кабинет' }, { label: 'ОСАГО' }];

  return (
    <>
      <div className={breadcrumbsWrapper}>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
      <Title text="ОСАГО" />
    </>
  );
};

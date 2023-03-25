import React, { FC, useMemo } from 'react';
import { ContainerWrapper } from '@marketplace/ui-kit';
import { Breadcrumbs } from 'components';
import { MenuItems } from 'constants/menuItems';

interface Props {
  title: string;
}

const BreadcrumbsDebitCard: FC<Props> = ({ title }) => {
  const breadcrumbs = useMemo(
    () => [
      {
        to: MenuItems.Finance.href,
        label: MenuItems.Finance.text,
      },
      {
        to: MenuItems.FinanceDebitCard.href,
        label: MenuItems.FinanceDebitCard.text,
      },
      {
        label: title,
      },
    ],
    [title],
  );
  return (
    <ContainerWrapper>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
    </ContainerWrapper>
  );
};

export { BreadcrumbsDebitCard };

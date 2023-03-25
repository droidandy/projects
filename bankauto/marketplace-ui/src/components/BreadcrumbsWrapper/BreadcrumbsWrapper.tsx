import { ContainerWrapper } from '@marketplace/ui-kit';
import React, { FC, memo } from 'react';
import Breadcrumbs, { Props as BreadcrumbsProps } from 'components/Breadcrumbs';

interface Props extends BreadcrumbsProps {}

const BreadcrumbsWrapperRoot: FC<Props> = ({ breadcrumbs }) => {
  return (
    <>
      <ContainerWrapper bgcolor="background.paper">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </ContainerWrapper>
    </>
  );
};

const BreadcrumbsWrapper = memo(BreadcrumbsWrapperRoot);

export { BreadcrumbsWrapper };

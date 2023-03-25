import React from 'react';
import { ContainerWrapper } from '@marketplace/ui-kit';
import { useBreakpoints } from '@marketplace/ui-kit';
import { useStyles } from './PageContainer.style';

type PageContainerProps = {
  children?: any;
};

export const PageContainer = ({ children }: PageContainerProps) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  return (
    <ContainerWrapper className={s.container}>
      <div className={s.content}>{children}</div>
    </ContainerWrapper>
  );
};

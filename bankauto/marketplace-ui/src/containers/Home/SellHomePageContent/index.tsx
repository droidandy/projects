import React, { FC, memo } from 'react';
import { ContainerWrapper, useBreakpoints } from '@marketplace/ui-kit';
import { PartnersSection } from 'components/PartnersSection';
import { BlogPosts } from 'containers/Home';
import { StepsBlock } from './components';

export const SellHomePageContent: FC = memo(() => {
  const { isMobile } = useBreakpoints();

  return (
    <>
      <ContainerWrapper bgcolor={!isMobile && 'grey.100'} pt={isMobile ? 2.5 : 0} pb={isMobile ? 2.5 : 7.5}>
        <StepsBlock />
      </ContainerWrapper>
      <ContainerWrapper pb={isMobile ? 2.5 : 5} style={isMobile ? { paddingRight: 0 } : {}}>
        <BlogPosts />
      </ContainerWrapper>
      <PartnersSection />
    </>
  );
});

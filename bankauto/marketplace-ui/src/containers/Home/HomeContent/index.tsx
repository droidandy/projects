import React, { FC, memo } from 'react';
import { ContainerWrapper, useBreakpoints } from '@marketplace/ui-kit';
import { useHomeState } from 'store/home';
import { PartnersSection } from 'components/PartnersSection';
import { BestOffersContainer, BlogPosts, BrandsContainer, PopularCollections } from 'containers/Home';

export const HomeContent: FC = memo(() => {
  const { isMobile } = useBreakpoints();
  const { activeTab } = useHomeState();

  return (
    <>
      <ContainerWrapper bgcolor={!isMobile && 'grey.100'} pb={isMobile ? 5 : 7.5} pt={isMobile ? 2.5 : 0}>
        <BrandsContainer />
      </ContainerWrapper>
      <ContainerWrapper pt={isMobile ? 1.5 : 5}>
        {/* @TODO: remove key when slider fixed */}
        <BestOffersContainer key={activeTab} />
      </ContainerWrapper>
      <ContainerWrapper pt={isMobile ? 0 : 5} pb={isMobile ? 0 : 7.5}>
        <PopularCollections />
      </ContainerWrapper>
      <ContainerWrapper
        bgcolor={isMobile ? 'common.white' : 'grey.100'}
        py={isMobile ? 2.5 : 5}
        style={isMobile ? { paddingRight: 0 } : {}}
      >
        <BlogPosts />
      </ContainerWrapper>
      <PartnersSection />
    </>
  );
});

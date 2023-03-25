import React from 'react';
import { ContainerWrapper, useBreakpoints } from '@marketplace/ui-kit';
import { useHomeState } from 'store/home';
import { BestOffersContainer, BrandsContainer, VehiclesCount } from 'containers/Instalment';
import { PartnersSection, SeoTitleTemp } from 'components';
import { BlogPosts } from 'containers/Home';
import { InstallmentSteps } from 'containers/Home/InstallmentSteps';
import { IS_INSTALLMENT_SPECIAL_PROGRAM } from 'constants/specialConstants';

const HomePageContent = () => {
  const { isMobile } = useBreakpoints();
  const { activeTab } = useHomeState();

  return (
    <>
      <ContainerWrapper bgcolor={!isMobile && 'grey.100'} pb={isMobile ? 2.5 : 7.5} pt={isMobile ? 2.5 : 0}>
        <InstallmentSteps />
      </ContainerWrapper>
      {IS_INSTALLMENT_SPECIAL_PROGRAM && (
        <ContainerWrapper pt={isMobile ? 2.5 : 5}>
          <SeoTitleTemp title=" #банкавто: автомобильный маркетплейс" />
        </ContainerWrapper>
      )}
      <ContainerWrapper pt={(IS_INSTALLMENT_SPECIAL_PROGRAM && '0') || (isMobile && 2.5) || 5}>
        <VehiclesCount />
      </ContainerWrapper>
      <ContainerWrapper pt={isMobile ? 1.5 : 4} pb={isMobile ? 5 : 7.5}>
        <BrandsContainer />
      </ContainerWrapper>
      <ContainerWrapper pt={isMobile ? 1.5 : 5}>
        {/* @TODO: remove key when slider fixed */}
        <BestOffersContainer key={activeTab} />
      </ContainerWrapper>
      <ContainerWrapper bgcolor="grey.100" py={isMobile ? 2.5 : 5} style={isMobile ? { paddingRight: 0 } : {}}>
        <BlogPosts />
      </ContainerWrapper>
      <PartnersSection />
    </>
  );
};

export { HomePageContent };

import React, { FC, useMemo } from 'react';
import { useBreakpoints } from '@marketplace/ui-kit';
import { LandingLayout } from 'layouts';
import { SpecialProgramsSlider } from 'containers/Home';
import { Meta, PartnersSection } from 'components';
import { Hero } from '../components';
import { FinanceCards, BlogPosts, AdvertiseList } from './components';
import { useStyles } from './FinanceRoot.styles';
import { ExchangeRates } from './components/ExchangeRates';
import { MainPageSection } from './types/MainPageSection';
import { PageInfo } from '../types/PageInfo';

const FinanceRoot: FC<{ mainPageSections: MainPageSection[]; pageInfo: PageInfo }> = ({
  mainPageSections,
  pageInfo,
}) => {
  const { partners, heroinnerContentClassName } = useStyles();
  const { isMobile } = useBreakpoints();
  const bgImage = useMemo(
    () => (isMobile ? pageInfo.imgMobile : pageInfo.imgDesktop),
    [isMobile, pageInfo.imgMobile, pageInfo.imgDesktop],
  );
  return (
    <>
      <Meta title={pageInfo.mainText} description={pageInfo.additionalText} />
      <LandingLayout>
        <Hero
          title={pageInfo.mainText}
          isShowButton={!!(pageInfo.buttonText && pageInfo.buttonLink)}
          subTitle={pageInfo.additionalText}
          buttonText={pageInfo.buttonText}
          buttonColor={pageInfo.buttonColor}
          link={pageInfo.buttonLink}
          bgImage={bgImage}
          innerContentClassName={heroinnerContentClassName}
        />

        <FinanceCards items={mainPageSections} />
        <ExchangeRates />
        <AdvertiseList />
        <BlogPosts />
        <SpecialProgramsSlider />
        <PartnersSection className={partners} />
      </LandingLayout>
    </>
  );
};

export { FinanceRoot };

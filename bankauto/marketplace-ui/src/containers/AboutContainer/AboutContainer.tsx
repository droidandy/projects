import React, { FC } from 'react';
import { LandingLayout } from 'layouts/LandingLayout';
import { HeroTitle, useBreakpoints } from '@marketplace/ui-kit';
import { Meta } from 'components/Meta';
import { AboutTextSection, AboutContactsSection, AboutMapSection } from './components';
import { useStyles } from './AboutContainer.styles';

const AboutContainer: FC = () => {
  const { isMobile } = useBreakpoints();
  const titleFraze = 'Уникальный маркетплейс \nдля автолюбителей';
  const getBgImage = () => (isMobile ? '/images/aboutHeroMobileImage.jpg' : '/images/aboutHeroImage.jpg');
  const { colorTitle } = useStyles();

  return (
    <>
      <Meta title={titleFraze} description={titleFraze} />
      <LandingLayout>
        <HeroTitle
          title={titleFraze}
          align="center"
          bgImageSrc={getBgImage()}
          addPt={7.5}
          addPb={5}
          className={colorTitle}
        />
        <AboutTextSection />
        <AboutContactsSection />
        <AboutMapSection longitude={37.558957} latitude={55.742119} />
      </LandingLayout>
    </>
  );
};

export { AboutContainer };

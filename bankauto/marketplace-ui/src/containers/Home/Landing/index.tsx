import React, { FC } from 'react';
import { ContainerWrapper, useBreakpoints } from '@marketplace/ui-kit';
import { Hero, StepsBlock, InfoBlock, StepsBlockMobile } from './components';
import { Link } from 'components';
import { ContentRedmond } from './components/Content/ContentRedmond';

export const LandingContainer: FC = () => {
  const { isMobile } = useBreakpoints();

  return (
    <>
      <Hero />
      {isMobile ? (
        <>
          <ContainerWrapper pb={2.75} pt={2.5} height={'20rem'}>
            <StepsBlockMobile
              steps={[
                <>Зарегистрируйтесь или забронируйте автомобиль</>,
                <>Получите промокод на 5000 рублей*</>,
                <>
                  Выберите технику на сайте партнера:{' '}
                  <Link href="https://clck.ru/akqFh" target={'_blank'}>
                    Skymoney Club
                  </Link>
                </>,
              ]}
            />
          </ContainerWrapper>
          <ContainerWrapper>
            <InfoBlock />
          </ContainerWrapper>
          <ContainerWrapper pb={5} pt={5} alignContent="center" bgcolor={'common.white'}>
            <ContentRedmond />
          </ContainerWrapper>
        </>
      ) : (
        <>
          <ContainerWrapper pb={10} pt={7.5} pl={46.625} pr={49} textAlign={'center'}>
            <StepsBlock />
          </ContainerWrapper>
          <ContainerWrapper pb={10} pt={5} pl={72} pr={73.625} textAlign={'center'} bgcolor={'grey.100'}>
            <InfoBlock />
          </ContainerWrapper>
          <ContainerWrapper pb={10} pt={10} alignContent="center" bgcolor={'common.white'}>
            <ContentRedmond />
          </ContainerWrapper>
        </>
      )}
    </>
  );
};

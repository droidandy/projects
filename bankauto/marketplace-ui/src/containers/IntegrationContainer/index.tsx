import React, { FC } from 'react';
import { ContainerWrapper, useBreakpoints, Divider } from '@marketplace/ui-kit';
import { Hero, TextBlock } from './components';
import { QuestionsBlock } from './QuestionsBlock';

export const IntegrationContainer: FC = () => {
  const { isMobile } = useBreakpoints();

  return (
    <>
      <Hero />
      {isMobile ? (
        <>
          <ContainerWrapper pb={5} pt={2.5}>
            <TextBlock />
          </ContainerWrapper>
          <ContainerWrapper pb={5} pt={2.5}>
            <QuestionsBlock />
          </ContainerWrapper>
        </>
      ) : (
        <>
          <ContainerWrapper pb={10} pt={10}>
            <TextBlock />
          </ContainerWrapper>
          <ContainerWrapper>
            <Divider />
          </ContainerWrapper>
          <ContainerWrapper pb={5} pt={2.5}>
            <QuestionsBlock />
          </ContainerWrapper>
        </>
      )}
    </>
  );
};

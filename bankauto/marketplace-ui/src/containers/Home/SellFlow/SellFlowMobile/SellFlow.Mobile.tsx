import React from 'react';
import { Box, Button, ContainerWrapper, Typography } from '@marketplace/ui-kit';
import { Swiper } from '../../../../components/Swiper';
import { useRouter } from 'next/router';
import { useStyles } from './SellFlow.Mobile.styles';
import { FillFormStep } from '../components/FillFormStep';
import { GetEvaluationStep } from '../components/GetEveluationStep';
import { PublishStep } from '../components/PublishStep';
import { ChooseOfferStep } from '../components/ChooseOfferStep';
import { MakeDealStep } from '../components/MakeDealStep';

export const sellFlowSteps = [
  <FillFormStep dark />,
  <GetEvaluationStep dark />,
  <PublishStep dark />,
  <ChooseOfferStep dark />,
  <MakeDealStep dark />,
];

export const SellFlowMobile = () => {
  const s = useStyles();
  const router = useRouter();

  const handleSubmit = () => {
    router.push('sell/create', 'sell/create');
  };

  return (
    <ContainerWrapper bgcolor="grey.100" className={s.root}>
      <Box textAlign="center" py={2.5}>
        <Typography component="h4" variant={'h4'} color="textPrimary">
          Как продать автомобиль
        </Typography>
      </Box>
      <Swiper loop={false} slidesPerView={1.1} centeredSlides spaceBetween={10}>
        {sellFlowSteps.map((step) => (
          <Box position="relative" className={s.slide}>
            {step}
          </Box>
        ))}
      </Swiper>
      <Box textAlign="center" p={2.5} pb={5}>
        <Button fullWidth variant="contained" size="large" color="primary" onClick={handleSubmit}>
          Продать
        </Button>
      </Box>
    </ContainerWrapper>
  );
};

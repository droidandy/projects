import React from 'react';
import { ReactComponent as IconStepArrow } from 'icons/iconStepArrow.svg';
import { Grid } from '@marketplace/ui-kit';
import { FillFormStep } from './components/FillFormStep';
import { GetEvaluationStep } from './components/GetEveluationStep';
import { PublishStep } from './components/PublishStep';
import { ChooseOfferStep } from './components/ChooseOfferStep';
import { MakeDealStep } from './components/MakeDealStep';

const sellFlowSteps = [
  <FillFormStep dark={false} />,
  <GetEvaluationStep dark={false} />,
  <PublishStep dark={false} />,
  <ChooseOfferStep dark={false} />,
  <MakeDealStep dark={false} />,
];

export const SellFlowDesktop = () => (
  <Grid container spacing={3} wrap="nowrap">
    {sellFlowSteps.map((step, index) => (
      <>
        <Grid item>{step}</Grid>
        {index !== sellFlowSteps.length - 1 && (
          <Grid item>
            <Grid container spacing={0} alignItems="center" style={{ height: '100%' }}>
              <IconStepArrow />
            </Grid>
          </Grid>
        )}
      </>
    ))}
  </Grid>
);

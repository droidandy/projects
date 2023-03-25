import * as React from 'react';

import * as s from './introScreenStyles';

import { ActionTypes, CallbackType } from '~/components/StepContainer/types';
import { Button } from '~/components/atoms/button';

export type IntroScreenProps = {
  callback?: CallbackType;
  title: string;
  subtitle: string;
  image: string;
  imageWidthPercent: number;
};

export const IntroScreen = ({
  callback, title, subtitle, image, imageWidthPercent,
}: IntroScreenProps): JSX.Element => {
  const toContinue = () => {
    callback
      && callback({
        type: ActionTypes.NAVIGATE_NEXT_SCREEN,
      });
  };

  return (
    <s.Slide>
      <s.Container>
        <s.Image name={image} imageWidth={imageWidthPercent} />
        <s.Label>{title}</s.Label>
        <s.Text>{subtitle}</s.Text>
      </s.Container>
      <s.Btn>
        <Button disabled={false} title="Ok" face="primary" onPress={toContinue} />
      </s.Btn>
    </s.Slide>
  );
};

import React from 'react';

import * as s from './feedbackSubmissionResultStyles';

import { Button } from '~/components/atoms/button';

type Props = {
  success: boolean;
  handlePress: (success: boolean) => void
};

export const FeedBackSubmissionResult = ({ success, handlePress }: Props): JSX.Element => (
  <s.Container>
    <s.Content>
      <s.Image name={success ? 'greenCheckmark' : 'redCross'} size={108} />
      <s.Title>
        {success ? 'Message Received!' : 'Delivery error'}
      </s.Title>
      <s.Subtitle>
        {success
          ? 'Thanks for your input! We’ll get back to you as soon as we can!'
          : 'We’re very sorry, but your messsage didn’t went through.'}
      </s.Subtitle>
    </s.Content>
    <s.Btn>
      <Button
        disabled={false}
        title="OK"
        face="blue"
        onPress={() => handlePress(success)}
      />
    </s.Btn>
  </s.Container>
);

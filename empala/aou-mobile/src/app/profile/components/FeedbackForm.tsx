import React, { useState } from 'react';

import * as s from '../module.styles';

import { Button } from '~/components/atoms/button/Button';
import { OnboardingLoader } from '~/components/atoms/loader';
import { theme } from '~/theme';

type Props = {
  isLoading: boolean
  submit: (message: string) => void,
  visible: boolean,
};

export const FeedbackForm = ({ isLoading, submit, visible }: Props): JSX.Element => {
  const [message, setMessage] = useState('');

  return (
    <s.FeedbackForm behavior="padding" visible={visible}>
      <s.FeedbackTitle>Got something to say?</s.FeedbackTitle>
      <s.FeedbackSubTitle>
        Like it, love it, hate it? Found some bugs? Let us know, we’re always happy to get feedback.
      </s.FeedbackSubTitle>
      <s.FeedBackInputContainer>
        <s.FeedbackInput
          multiline
          placeholder="Message"
          onChangeText={(text) => setMessage(text)}
          value={message}
        />
        {isLoading && (
        <s.LoaderContainer>
          <s.LoaderBackground />
          <OnboardingLoader color={theme.colors.GreyLoader} />
        </s.LoaderContainer>
        )}
      </s.FeedBackInputContainer>
      <s.Btn>
        {message.length !== 0 && (
        <Button
          disabled={isLoading}
          title={isLoading ? 'SENDING' : 'SEND'}
          face="blue"
          onPress={() => submit(message)}
        />
        )}
      </s.Btn>
    </s.FeedbackForm>
  );
};

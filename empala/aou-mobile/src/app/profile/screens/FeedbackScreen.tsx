import { useHeaderHeight } from '@react-navigation/elements';
import React, { useCallback, useMemo, useState } from 'react';

import { FeedbackForm } from '../components/FeedbackForm';
import { FeedBackSubmissionResult } from '../components/FeedbackSubmissionResult';
import * as s from '../module.styles';

import { ProfileNavProps } from '~/app/home/navigation/types';
import { usePost } from '~/network/useFetch';
import Theme from '~/theme';

type Props = {
  navigation: ProfileNavProps;
};

const renderResult = (success: boolean, handlePress: (success: boolean) => void) => (
  <FeedBackSubmissionResult success={success} handlePress={handlePress} />
);

export const FeedbackScreen = ({ navigation }: Props): JSX.Element => {
  const headerHeight = useHeaderHeight();

  const [showResult, setShowResult] = useState(false);

  const [{ isLoading, response, error }, doFetch] = usePost('');

  const submit = useCallback((message: string) => {
    setShowResult(true);
    doFetch({ message });
  }, [doFetch]);

  const renderForm = useCallback(
    (loading: boolean, handleSubmit: (message: string) => void, visible: boolean) => (
      <FeedbackForm isLoading={loading} submit={handleSubmit} visible={visible} />
    ), [isLoading],
  );

  const result = useMemo(() => Boolean(showResult && (error || response)), [showResult, error, response]);

  const handleResultPress = (success: boolean) => {
    success ? navigation.goBack() : setShowResult(false);
  };

  return (
    <Theme>
      <s.SafeArea>
        <s.HeaderBackground headerHeight={headerHeight} />
        {renderForm(isLoading, submit, !result)}
        {result && renderResult(Boolean(response), handleResultPress)}
      </s.SafeArea>
    </Theme>
  );
};

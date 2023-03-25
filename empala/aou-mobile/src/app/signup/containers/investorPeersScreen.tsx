import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { useCallback, useEffect } from 'react';

import * as s from './module.styles';

import { InvestopeerCard } from '~/app/signup/components';
import { ActionTypes, CallbackType, Meta } from '~/components/StepContainer/types';
import { Button } from '~/components/atoms/button';
import { Header } from '~/components/molecules/header';
import { User } from '~/graphQL/core/generated-types';
import { useOnboardingLoader } from '~/app/signup/hooks/useOnboardingLoader';
import { useSwipeBack } from '~/hooks/useSwipeBack';
import { StepIndicator } from "~/components/molecules/stepIndicator";

export type InvestorPeersScreenProps = {
  callback?: CallbackType;
  title: string;
  subtitle: string;
  dataFieldName: string;
  fetchData: (arg?: unknown) => User[];
  meta: Meta;
};

export const InvestorPeersScreen = ({
  callback,
  title,
  subtitle,
  dataFieldName,
  fetchData,
  meta
}: InvestorPeersScreenProps): JSX.Element => {
  const [selected, setSelected] = React.useState<Array<string>>([]);

  const investopeers = fetchData();

  const setLoading = useOnboardingLoader();
  useEffect(() => {
    investopeers?.length && setLoading(false);
  }, [investopeers]);

  const toContinue = useCallback(() => {
    callback?.({
      type: ActionTypes.NEXT_SCREEN,
      args: {
        [dataFieldName]: selected,
      },
    });
    setLoading(true);
  }, [callback, dataFieldName, selected, setLoading]);

  const navigation = useNavigation();
  const goBack = () => navigation.goBack();

  const SwipeBackHandler = useSwipeBack(goBack);

  const follow = React.useCallback((investopeerId: string) => {
    setSelected((prevState) => {
      const index = prevState.indexOf(investopeerId);
      if (index >= 0) {
        prevState.splice(index, 1);
        return [...prevState];
      }
      return [...prevState, investopeerId];
    });
  }, [selected]);

  const renderInvestopeers = () => investopeers.map((item) => {
    const followed = selected.includes(item.id);

    return (
      <InvestopeerCard
        key={item.id}
        userName={item.userName}
        followers={item.nFollowers}
        hunches={item.nHunches}
        stacks={item.nStacks}
        source={{ uri: `data:image/png;base64,${item.avatar}` }}
        onPress={() => follow(item.id)}
        followed={followed}
      />
    );
  });

  return (
    <>
      <s.ScreenContainer edges={['bottom', 'right', 'left']}>
        <SwipeBackHandler>
          <Header title={title} subtitle={subtitle} />
        </SwipeBackHandler>
        <s.Scroll horizontal showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
          {renderInvestopeers()}
        </s.Scroll>
        <s.ButtonContainer>
          <SwipeBackHandler>
            <Button disabled={false} title="Continue" face="primary" onPress={toContinue} />
          </SwipeBackHandler>
        </s.ButtonContainer>
      </s.ScreenContainer>
      <StepIndicator
        totalSteps={meta.totalScreens}
        activeIndex={meta.screenIndex}
        goPrevStep={goBack}
      />
    </>
  );
};

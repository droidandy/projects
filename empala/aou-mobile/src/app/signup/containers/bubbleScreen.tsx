import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { ReactNode, useCallback, useEffect } from 'react';
import { Animated } from 'react-native';

import * as s from './module.styles';

import { Routes } from '~/app/home/navigation/routes';
import { OnboardingNavProps } from '~/app/home/navigation/types';
import { useBubble, useOnboardingLoader } from '~/app/signup/hooks';
import { BubbleScreenData, DataFieldsType } from '~/app/signup/types';
import { useBackgroundJob } from '~/components/StepContainer/hooks/useBackgroundJob';
import { ActionTypes, CallbackType, Meta } from '~/components/StepContainer/types';
import { Button } from '~/components/atoms/button';
import { Icon } from '~/components/atoms/icon';
import { Header } from '~/components/molecules/header';
import { StepIndicator } from '~/components/molecules/stepIndicator';
import layout from '~/constants/Layout';
import { useSwipeBack } from '~/hooks/useSwipeBack';
import { welcome } from '~/store/auth';
import store from '~/store/createStore';

export type BubbleScreenProps = {
  withAction?: boolean | undefined;
  callback?: CallbackType;
  title: string;
  subtitle: string;
  dataFieldName: keyof DataFieldsType;
  selectionRequired?: boolean;
  fetchData: (arg: unknown) => BubbleScreenData;
  children?: (arg: unknown) => ReactNode;
  meta: Meta;
};

export const BubbleScreen = ({
  withAction = false,
  callback,
  title,
  subtitle,
  dataFieldName,
  fetchData,
  children,
  selectionRequired = false,
  meta,
  ...rest
}: BubbleScreenProps): JSX.Element => {
  const setLoading = useOnboardingLoader();
  const { selected, BubbleSelect } = useBubble();
  const { data, otherData } = fetchData(rest);

  const runJob = useBackgroundJob();

  useEffect(() => {
    data?.length && setLoading(false);
  }, [data]);

  const { width: screenWidth } = layout;

  const WIDTH_FACTOR = 2;
  const fullWidth = screenWidth * WIDTH_FACTOR;
  const initialRight = -(fullWidth - screenWidth) / 2;

  const slideAnim = React.useRef(new Animated.Value(initialRight)).current;
  const slideOutLeft = (onAnimationEnd: () => void) => {
    Animated.timing(slideAnim, {
      toValue: screenWidth - initialRight,
      duration: 2000,
      useNativeDriver: false,
    }).start(onAnimationEnd);
  };

  const slideOutRight = (onAnimationEnd: () => void) => {
    Animated.timing(slideAnim, {
      toValue: -fullWidth,
      duration: 2000,
      useNativeDriver: false,
    }).start(onAnimationEnd);
  };

  const slideInRight = (onAnimationEnd: () => void = () => { }) => {
    Animated.timing(slideAnim, {
      toValue: initialRight,
      duration: 2000,
      useNativeDriver: false,
    }).start(onAnimationEnd);
  };

  const navigation = useNavigation<OnboardingNavProps>();
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (slideAnim.__getValue() !== initialRight) {
        slideInRight();
      }
    });

    return unsubscribe;
  }, [navigation]);

  const toContinue = useCallback(() => {
    setLoading(true);
    slideOutLeft(() => {
      callback?.({
        type: ActionTypes.NEXT_SCREEN,
        args: {
          [dataFieldName]: selected,
        },
      });
      runJob(dataFieldName, selected);
    });
  }, [setLoading, callback, dataFieldName, selected, runJob]);

  const goBack = useCallback(() => {
    if (navigation.canGoBack()) {
      slideOutRight(navigation.goBack);
    } else {
      store.dispatch(welcome());
    }
  }, [navigation, slideOutRight]);

  const onPressAction = () => navigation.navigate(Routes.ModalScreen);

  const SwipeBackHandler = useSwipeBack(goBack);

  return (
    <s.Slide edges={['bottom', 'right', 'left']}>
      <SwipeBackHandler>
        <Header title={title} subtitle={subtitle} />
        {children && children({ ...rest, ...otherData })}
      </SwipeBackHandler>
      <s.BubbleSelectContainer>
        <s.AnimatedView width={fullWidth} style={{ right: slideAnim }}>
          <BubbleSelect data={data} />
        </s.AnimatedView>
      </s.BubbleSelectContainer>
      <s.Btn>
        <s.BtnWrapper>
          <SwipeBackHandler>
            <Button
              disabled={selectionRequired && selected.length === 0}
              title="Continue"
              face="primary"
              onPress={toContinue}
            />
          </SwipeBackHandler>
        </s.BtnWrapper>
        {withAction && (
          <s.Action onPress={onPressAction}>
            <Icon name="loupe" size={24} color="#fff" />
          </s.Action>
        )}
      </s.Btn>
      <StepIndicator
        totalSteps={meta.totalScreens}
        activeIndex={meta.screenIndex}
        goPrevStep={goBack}
      />
    </s.Slide>
  );
};

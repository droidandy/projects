import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import {
  ReactNode, useCallback, useEffect, useState,
} from 'react';
import { Animated, KeyboardAvoidingView, Keyboard } from 'react-native';

import * as s from './bubblesWithTextInputStyles';

import { useBubble, useOnboardingLoader } from '~/app/signup/hooks';
import { BubbleScreenData } from '~/app/signup/types';
import { ActionTypes, CallbackType, Meta } from '~/components/StepContainer/types';
import { Button } from '~/components/atoms/button';
import { Input } from '~/components/atoms/input';
import { Header } from '~/components/molecules/header';
import { StepIndicator } from "~/components/molecules/stepIndicator";
import layout from '~/constants/Layout';
import { useSwipeBack } from '~/hooks/useSwipeBack';
import Theme from '~/theme';

export type BubblesWithTextInputScreenProps = {
  callback?: CallbackType;
  title: string;
  subtitle: string;
  dataFieldName: string;
  selectionRequired?: boolean;
  fetchData: (arg: unknown) => BubbleScreenData;
  children?: (arg: unknown) => ReactNode;
  meta: Meta;
};

export const BubblesWithTextInputScreen = ({
  callback,
  title,
  subtitle,
  dataFieldName,
  fetchData,
  children,
  selectionRequired = true,
  meta,
  ...rest
}: BubblesWithTextInputScreenProps): JSX.Element => {
  const setLoading = useOnboardingLoader();
  const { BubbleSelect } = useBubble();
  const { data, otherData } = fetchData(rest);
  const [stackName, setStackName] = useState<string>('');
  const [keyboardStatus, setKeyboardStatus] = useState<boolean>();

  useEffect(() => {
    data?.length && setLoading(false);
  }, [data]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

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

  const navigation = useNavigation();
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (slideAnim.__getValue() !== initialRight) {
        slideInRight();
      }
    });

    return unsubscribe;
  }, [navigation]);

  const toContinue = useCallback(() => {
    if (!keyboardStatus) {
      slideOutLeft(
        () => callback?.({
          type: ActionTypes.NEXT_SCREEN,
          args: {
            [dataFieldName]: stackName,
          },
        }),
      );
    } else {
      callback?.({
        type: ActionTypes.NEXT_SCREEN,
        args: {
          [dataFieldName]: stackName,
        },
      });
    }
  }, [callback, dataFieldName, stackName, keyboardStatus]);

  const goBack = useCallback(() => {
    if (navigation.canGoBack()) {
      slideOutRight(navigation.goBack);
    }
  }, [navigation, slideOutRight]);

  const SwipeBackHandler = useSwipeBack(goBack);

  return (
    <Theme>
      <s.Slide edges={['bottom', 'right', 'left']}>
        <SwipeBackHandler>
          <Header title={title} subtitle={subtitle} />
          {children && children({ ...rest, ...otherData })}
        </SwipeBackHandler>

        <s.TextInputContainer>
          <Input
            label="Stack:"
            placeholder="Name your investack™"
            value={stackName}
            onChangeText={setStackName}
          />
        </s.TextInputContainer>

        <s.BubbleSelectContainer>
          <s.AnimatedView width={fullWidth} style={{ right: slideAnim }}>
            <BubbleSelect
              data={data.map((v) => ({ ...v, color: 'white', fontColor: '#000' }))}
              allowsMultipleSelection={false}
            />
          </s.AnimatedView>
        </s.BubbleSelectContainer>

        <KeyboardAvoidingView
          behavior="padding"
          style={{ width: '100%' }}
          keyboardVerticalOffset={15}
        >
          <s.Btn>
            <SwipeBackHandler>
              <Button
                disabled={!stackName}
                title="Continue"
                face="primary"
                onPress={toContinue}
              />
            </SwipeBackHandler>
          </s.Btn>
        </KeyboardAvoidingView>
        <StepIndicator
          totalSteps={meta.totalScreens}
          activeIndex={meta.screenIndex}
          goPrevStep={goBack}
        />
      </s.Slide>
    </Theme>
  );
};

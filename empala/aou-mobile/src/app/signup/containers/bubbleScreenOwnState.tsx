import { BubbleNode } from '@dehimer/react-native-bubble-select';
import { useNavigation } from '@react-navigation/native';
import { differenceWith } from 'lodash';
import * as React from 'react';
import {
  useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { Animated } from 'react-native';

import { BubbleScreenProps } from './bubbleScreen';
import * as s from './module.styles';

import { Routes } from '~/app/home/navigation/routes';
import { OnboardingNavProps } from '~/app/home/navigation/types';
import { useBubble, useOnboardingLoader } from '~/app/signup/hooks';
import { OnboardingContextData } from '~/app/signup/types';
import { equalById } from '~/app/signup/utils';
import { useBackgroundJob } from '~/components/StepContainer/hooks/useBackgroundJob';
import { ActionTypes, SCContext, StepContainerContext } from '~/components/StepContainer/types';
import { Button } from '~/components/atoms/button';
import { Icon } from '~/components/atoms/icon';
import { Header } from '~/components/molecules/header';
import { StepIndicator } from '~/components/molecules/stepIndicator';
import layout from '~/constants/Layout';
import { useSwipeBack } from '~/hooks/useSwipeBack';

const WIDTH_FACTOR = 2;

export const BubbleScreenOwnState = ({
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
  const { data, otherData } = fetchData(rest);
  const runJob = useBackgroundJob();

  const { scState, setSCState } = useContext<SCContext>(StepContainerContext);

  const [ctxSelectedPrev, setCtxSelectedPrev] = useState<BubbleNode[] | undefined>();
  const [deselectedInSearcher, setDeselectedInSearcher] = useState<BubbleNode[] | undefined>();
  const [bubblesToShow, setBubblesToShow] = useState<BubbleNode[] | undefined>();

  const { selected, setSelected, BubbleSelect } = useBubble();

  const ctxData = useMemo(
    () => {
      const newData = (scState as OnboardingContextData)[dataFieldName] as BubbleNode[] | undefined;
      const d = differenceWith(ctxSelectedPrev, newData || [], equalById);
      setDeselectedInSearcher(d);
      setCtxSelectedPrev(newData);
      return newData;
    }, [scState, dataFieldName],
  );

  useEffect(() => {
    setSelected(ctxData || []);
  }, [ctxData]);

  useEffect(() => {
    data?.length && setLoading(false);
  }, [data]);

  useEffect(() => {
    !bubblesToShow && setBubblesToShow(data);
  }, [bubblesToShow, data]);

  useEffect(() => {
    setBubblesToShow((prev) => prev?.map((bubble) => {
      const { id, text } = bubble;
      if (deselectedInSearcher?.some((i) => i.id === id)) {
        const newText = text.endsWith(' ') ? text.trimEnd() : `${text} `;
        return { ...bubble, text: newText };
      } return bubble;
    }));
  }, [deselectedInSearcher]);

  const calculateNewSelectionState = useCallback(() => {
    const notSelected = differenceWith(data, selected, equalById);
    const deselectedRemoved = differenceWith(selected, notSelected, equalById);
    return deselectedRemoved;
  }, [data, selected]);

  const { width: screenWidth } = layout;

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
    const newSelectionState = calculateNewSelectionState();
    slideOutLeft(() => {
      callback?.({
        type: ActionTypes.NEXT_SCREEN,
        args: { [dataFieldName]: newSelectionState },
      });
      runJob(dataFieldName, newSelectionState);
    });
  }, [calculateNewSelectionState]);

  const goBack = () => navigation.canGoBack() && slideOutRight(navigation.goBack);

  const onPressAction = useCallback(() => {
    callback?.({
      type: ActionTypes.PUT,
      args: { [dataFieldName]: calculateNewSelectionState() },
    });
    navigation.navigate(Routes.ModalScreen);
  }, [navigation, dataFieldName, calculateNewSelectionState]);

  const SwipeBackHandler = useSwipeBack(goBack);

  return (
    <s.Slide edges={['bottom', 'right', 'left']}>
      <SwipeBackHandler>
        <Header title={title} subtitle={subtitle} />
        {children && children({ ...rest, ...otherData })}
      </SwipeBackHandler>
      <s.BubbleSelectContainer>
        <s.AnimatedView width={fullWidth} style={{ right: slideAnim }}>
          <BubbleSelect
            data={bubblesToShow || []}
            initialSelection={selected.map((i) => i.id)}
            allowsMultipleSelection
          />
        </s.AnimatedView>
      </s.BubbleSelectContainer>
      <s.Btn>
        <s.BtnWrapper>
          <SwipeBackHandler>
            <Button
              disabled={selectionRequired && ((ctxData && ctxData.length > 0) || selected.length > 0)}
              title="Continue "
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

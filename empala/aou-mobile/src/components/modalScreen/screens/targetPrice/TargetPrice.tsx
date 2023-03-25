import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useMemo, useCallback } from 'react';
import { LayoutChangeEvent, LayoutRectangle } from 'react-native';

import * as s from './targetPriceStyles';

import { Routes } from '~/app/home/navigation/routes';
import { RootStackParamList } from '~/app/home/navigation/types';
import { SwitchIcon } from '~/assets/icons/Icons';
import { Button } from '~/components/atoms/button';
import { getRightFractionatedValue, getValidPercentString, getValidPriceString } from '~/utils/formatter';

const PERCENT_SYMBOL = '%';
const CURRENCY_SYMBOL = '$';

const MAX_PERCENT_STRING_LENGTH = 6;

const SCALE_COEF = 15;

const getChangePercent = (fromValue: number, toValue: number): number =>
  (((toValue - fromValue) * 100) / fromValue);

type NavigationProps = StackNavigationProp<RootStackParamList, Routes.CreateModal>;
type Props = {
  navigation: NavigationProps,
  backScreen: Routes,
  defaultValue: number,
};

export const TargetPriceModal = ({
  navigation,
  backScreen,
  defaultValue: currentPrice = 0,
}: Props): JSX.Element => {
  const [isPercentMode, setMode] = useState<boolean>();

  const [percent, setPercent] = useState<string>('0');
  const [price, setPrice] = useState<string>(currentPrice.toString())

  const leftValue = useMemo(() => {
    if (isPercentMode) {
      return `${CURRENCY_SYMBOL}${price}`;
    }

    return `${percent}${PERCENT_SYMBOL}`;
  }, [isPercentMode, percent, price]);

  const rightValue = useMemo(
    () => isPercentMode ? percent : price,
    [isPercentMode, percent, price],
  );

  const handleValueChange = useCallback((value: string) => {
    const foundValue = isPercentMode ? getValidPercentString(percent, value) : getValidPriceString(price, value);

    if (typeof foundValue === 'string') {
      if (isPercentMode) {
        if (foundValue !== percent) {
          setPercent(foundValue);
        }

        if (foundValue) {
          const priceValue = (Number(foundValue) / 100 + 1) * currentPrice;

          setPrice(getRightFractionatedValue(`${priceValue}`) ?? `${currentPrice}`);
        } else {
          setPrice(`${currentPrice}`);
        }
      } else {
        if (foundValue !== price) {
          setPrice(foundValue);
        }

        if (foundValue) {
          const percentValue = getChangePercent(currentPrice, Number(foundValue));
          setPercent(getRightFractionatedValue(percentValue) ?? '0');
        } else {
          setPercent('0');
        }
      }
    }
  }, [isPercentMode, currentPrice, price, percent]);

  const scale = useMemo(
    () => {
      const percent = getChangePercent(currentPrice, price);
      const percentsMaskTextDiff = (getRightFractionatedValue(percent)?.length - MAX_PERCENT_STRING_LENGTH);

      return Math.min(1, 1 - percentsMaskTextDiff / SCALE_COEF);
    },
    [price, currentPrice],
  );

  const onContinue = () => {
    navigation.navigate(backScreen, { selectedValue: { targetPrice: price } });
  };

  const switchPress = () => {
    setMode(!isPercentMode);
  };

  const [inputSizes, setInputSizes] = useState<LayoutRectangle>({
    x: 0,
    y: 0,
    height: 0,
    width: 0
  });

  const handleInputLayoutChange = useCallback(
    (event: LayoutChangeEvent) => {
      setInputSizes(event.nativeEvent.layout);
    },
    []
  )

  return (
    <s.Container>
      <s.BodyContainer>
        <s.LeftText testID="leftText" scale={scale}>
          {leftValue}
        </s.LeftText>

        <s.SwitchButton onPress={switchPress} testID="switchButton">
          <SwitchIcon />
        </s.SwitchButton>

        <s.RightTextWrapper>
          {!isPercentMode && <s.RightTextInputLabel scale={scale}>$</s.RightTextInputLabel>}
          <s.RightTextInputWrapper>
            <s.RightTextInput
              onLayout={handleInputLayoutChange}
              scale={scale}
              keyboardType="decimal-pad"
              value={rightValue}
              placeholder={isPercentMode ? '0' : `${currentPrice}`}
            />
            <s.RightTextInputCatcher
              scale={scale}
              autoFocus
              keyboardType="decimal-pad"
              value={rightValue}
              testID="input"
              onChangeText={handleValueChange}
              placeholder={isPercentMode ? '0' : `${currentPrice}`}
              {...inputSizes}
            />
          </s.RightTextInputWrapper>
          {isPercentMode && <s.RightTextInputLabel scale={scale}>%</s.RightTextInputLabel>}
        </s.RightTextWrapper>

      </s.BodyContainer>

      <s.ButtonsContainer>
        <Button title={'Set Price'.toUpperCase()} face="green" onPress={onContinue} />
      </s.ButtonsContainer>

    </s.Container>
  );
};

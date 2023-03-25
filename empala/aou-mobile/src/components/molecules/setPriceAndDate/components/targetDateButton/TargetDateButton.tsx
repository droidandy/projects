import React from 'react';
import { ActivityIndicator } from 'react-native';

import * as Styles from './targetDateButtonStyles';

import Theme from '~/theme';
import { Icon } from '~/components/atoms/icon';

type Props = {
  title: string;
  value?: string;
  onPress?: () => void;
};

export const TargetDateButton = ({
  title, value, onPress,
}: Props): JSX.Element => {
  if (value) {
    return (
      <Theme>
        <Styles.Button onPress={onPress}>
          <Styles.ButtonContainer>
            <Styles.PriceTitleContainer>
              <Styles.PriceTitle>Target date</Styles.PriceTitle>
            </Styles.PriceTitleContainer>

            <Styles.PriceContainer>
              <Styles.PriceText>{value}</Styles.PriceText>
            </Styles.PriceContainer>

            <Icon name="rightArrow" color="white" width={11} />
          </Styles.ButtonContainer>
        </Styles.Button>
      </Theme>
    );
  }

  return (
    <Theme>
      <Styles.Button onPress={onPress}>
        <Styles.ButtonContainer>
          <Styles.TitleContainer>
            <Styles.Title>{title}</Styles.Title>
          </Styles.TitleContainer>
          <Icon name="rightArrow" color="white" width={11} />
        </Styles.ButtonContainer>
      </Styles.Button>
    </Theme>
  );
}

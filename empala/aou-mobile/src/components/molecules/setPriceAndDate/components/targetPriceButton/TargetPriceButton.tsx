import React from 'react';

import * as Styles from './TargetPriceButtonStyles';

import { Icon } from '~/components/atoms/icon';
import Theme from '~/theme';

type Props = {
  title: string;
  value?: number;
  percent?: number;
  onPress?: () => void;
};

export const TargetPriceButton = ({
  title, value, percent, onPress,
}: Props): JSX.Element => {
  if (value) {
    return (
      <Theme>
        <Styles.Button onPress={onPress}>
          <Styles.ButtonContainer>
            <Styles.PriceTitleContainer>
              <Styles.PriceTitle>Target price</Styles.PriceTitle>
            </Styles.PriceTitleContainer>

            <Styles.PriceContainer>
              <Styles.PriceText>{`$${value}`}</Styles.PriceText>
              <Styles.PercentText>
                {percent && percent > 0 ? '+' : ''}
                {percent?.toFixed(1)}
                %
              </Styles.PercentText>
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
};

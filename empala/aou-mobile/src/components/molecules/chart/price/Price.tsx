import React from 'react';
import { StyleProp, ViewProps } from 'react-native';

import * as s from './styles';
import upLineWithArrow from '~/assets/icons/lib/upLineWithArrow';
import downLineWithArrow from '~/assets/icons/lib/downLineWIthArrow';
import { useTheme } from 'styled-components';
import { ExtraInfoWrapper, LineIconWrapper } from './styles';

type Props = {
  companyId: string;
  style?: StyleProp<ViewProps>;
};

export const Price = ({ companyId, style }: Props): JSX.Element => {
  const {
    price,
    percentChange,
    priceChange,
    date,
  } = MOCKED_COMPANY_PRICE; // TODO get real data of company by companyId
  const theme = useTheme();

  const LineIcon = percentChange < 0 ? downLineWithArrow : upLineWithArrow;

  return (
    <s.Wrapper style={style}>
      <s.Price>${price}</s.Price>
      <s.ExtraInfo>
        <s.ExtraInfoWrapper>
          <s.LineIconWrapper>
            <LineIcon fillColor={theme.colors.GreyDarkest} />
          </s.LineIconWrapper>
          <s.ExtraInfo>
            {`$${priceChange} (${percentChange}%) • ${date}`}
          </s.ExtraInfo>
        </s.ExtraInfoWrapper>
      </s.ExtraInfo>
    </s.Wrapper>
  );
};

const MOCKED_COMPANY_PRICE = {
  price: 214,
  percentChange: 3,
  priceChange: 4.58,
  date: 'Today',
};

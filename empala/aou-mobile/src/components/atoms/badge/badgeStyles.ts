import styled from 'styled-components/native';

import { Icon } from '~/components/atoms/icon/Icon';
import layout from '~/constants/Layout';

const width = layout.width * 0.4;
const borderWidth = 4;
const innerWidth = width - borderWidth * 4;
const innerRadius = (width - borderWidth * 2) / 2;

export const Container = styled.View({
  flexGrow: 1,
  alignItems: 'center',
  marginTop: 100,
});

export const OuterCircle = styled.View({
  alignSelf: 'center',
  width,
  height: width,
  borderRadius: width / 2,
  borderWidth,
  borderColor: 'white',
  padding: borderWidth,
});

export const InnerCircle = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  width: innerWidth,
  height: innerWidth,
  borderRadius: innerRadius,
  borderWidth: 1,
  borderColor: 'white',
  backgroundColor: 'white',
});

export const BadgeIcon = styled(Icon).attrs(() => ({
  size: width / 3,
}))({});

export const Text = styled.Text({
  marginTop: 24,
  fontSize: 16,
  fontWeight: 700,
  color: 'white',
});

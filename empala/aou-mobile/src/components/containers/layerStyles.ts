import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';

export const Container = styled.View`
  background-color: transparent;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

export const GradientLayer = styled(LinearGradient).attrs(() => ({
  start: { x: 0.8, y: 0 },
  end: { x: 0.3, y: 1 },
  colors: ['#00C0BF', '#245CC0'],
}))`
  flex: 1;
  background-color: transparent;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

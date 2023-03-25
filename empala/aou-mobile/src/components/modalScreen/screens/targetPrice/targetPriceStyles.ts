import TextInputMask from 'react-native-text-input-mask';
import { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  justify-content: space-between;
  align-items: center;
`;

export const BodyContainer = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding-left: 25px;
  padding-right: 32px;
  padding-bottom: 27px;
  overflow: hidden;
`;

export const LeftText = styled.Text<{ scale: number }>`
  font-family: 'Inter_500Medium';
  font-size: ${({ scale }) => 24 * scale}px;
  font-weight: 500;
  opacity: 0.5;
  color: white;
  min-width: 20%;
`;

export const ButtonsContainer = styled.View`
  width: 100%;
  justify-content: space-between;
  padding: 0 16px;
`;

export const SwitchButton = styled.TouchableOpacity`
`;

export const TextInput = styled(TextInputMask)<{ scale: number }>`
  font-family: 'Inter_500Medium';
  font-size: ${({ scale }) => 36 * scale}px;
  font-weight: 500; 
  text-align: left;
  color: white;
  height: 68px;
  min-width: 20%;
`;

export const RightTextWrapper = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 68px;
  min-width: 20%;
  overflow: visible;
`;

const getRightTextStyles = (scale: number): FlattenSimpleInterpolation => css`
  font-family: 'Inter_500Medium';
  font-size: ${36 * scale}px;
  font-weight: 500;
  text-align: left;
  color: white;
`;

export const RightTextInputLabel = styled.Text<{ scale: number }>`
  ${({ scale }) => getRightTextStyles(scale)}
`;

export const RightTextInputWrapper = styled.View`
  position: relative;
`;

export const RightTextInput = styled.TextInput<{
  scale: number;
}>`
  ${({ scale }) => getRightTextStyles(scale)};
  position: relative;
`;

export const RightTextInputCatcher = styled(RightTextInput).attrs(({ theme }) => ({
  placeholderTextColor: theme.formatterColor.Light200
}))<{
  x?: number;
  y?: number;
  height?: number;
  width?: number;
}>`
  position: absolute;
  left: ${({ x }) => `${x}px`};
  top: ${({ y }) => `${y}px`};
  height: ${({ height }) => `${height}px`};
  width: ${({ width }) => `${width}px`};
  color: transparent;
`;

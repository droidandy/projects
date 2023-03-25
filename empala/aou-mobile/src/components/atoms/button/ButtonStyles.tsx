import { BlurView } from '@react-native-community/blur';
import styled, { css } from 'styled-components/native';

export type ButtonFace = 'primary' | 'secondary' | 'third' | 'selected' | 'green' | 'blue';

export const Container = styled.View`
  width: 100%;
`;

export const Button = styled.TouchableOpacity<{ disabled?: boolean; face?: ButtonFace }>`
  height: 56px;
  border-radius: 32px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  border: 0;
  overflow: hidden;

  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};

  ${({ face }) => face === 'primary'
    && css`
      background-color: #ffffff20;
    `}

  ${({ face }) => face === 'secondary'
    && css`
      background-color: ${({ theme }) => theme.colors.Green200};
    `}

  ${({ face }) => face === 'third'
    && css`
      border: 1px;
      border-color: #ffffff30;
    `}

  ${({ face }) => face === 'selected'
    && css`
      background-color: ${({ theme }) => theme.colors.Grey200};
    `}

  ${({ face }) => face === 'green'
    && css`
      background-color: ${({ theme }) => theme.colors.Green200};
    `}

  ${({ face }) => face === 'blue'
  && css`
    background-color: ${({ theme }) => theme.colors.BrandBlue200};
  `}
`;

export const Title = styled.Text<{ face?: string }>`
  font-family: 'Inter_700Bold';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;

  color: ${({ theme }) => theme.colors.White};
  ${({ face }) => face === 'selected'
    && css`
    color: ${({ theme }) => theme.colors.Grey800};
  `}
`;

export const BlurBackdrop = styled(BlurView)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

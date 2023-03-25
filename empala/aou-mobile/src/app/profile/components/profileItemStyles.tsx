import styled, { css } from 'styled-components/native';

export enum FaceType {
  primary = 'primary',
  secondary = 'secondary',
  tertiary = 'tertiary',
}

export const Container = styled.View`
  padding: 16px;
`;

export const Row = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

export const Separator = styled.View`
  margin-top: 16px;
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.formatterColor.Dark200};
`;

export const Text = styled.Text<{ face: FaceType }>`
  flex-grow: 1;
  font-weight: bold;
  ${({ face }) => face === FaceType.primary
    && css`
      color: ${({ theme }) => theme.colors.Grey800};
      font-size: 16px;
    `}
  ${({ face }) => face === FaceType.secondary
    && css`
      color: ${({ theme }) => theme.colors.White};
      font-family: 'Baloo2_700Bold';
      font-size: 22px;
    `}

  ${({ face }) => face === FaceType.tertiary
          && css`
      color: ${({ theme }) => theme.formatterColor.Dark400};
      font-size: 16px;
      font-weight: 400;
    `}
`;

export const SubText = styled.Text`
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme }): string => theme.colors.GreyDarkest};
`;

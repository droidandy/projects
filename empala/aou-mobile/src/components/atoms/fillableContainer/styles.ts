import styled from 'styled-components/native';

export const Wrapper = styled.View`
  position: relative;
`;

export const Filler = styled.View<{ color?: string; percentage: number; }>`
  position: absolute;
  height: 100%;
  left: 0;
  top: 0;
  width: ${({ percentage }): number => percentage ?? 0}%;
  background-color: ${({ color, theme }): string => (color ?? theme.formatterColor.Dark200)};
  opacity: 0.5;
`;

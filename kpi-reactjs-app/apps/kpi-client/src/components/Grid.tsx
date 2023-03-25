import styled from 'styled-components';

interface RowProps {
  gutter?: number;
}

const DEFAULT_GUTTER = 30;

export const Col = styled.div<{ grow?: number }>`
  width: 100%;
  flex-grow: ${props => props.grow || 1};
  flex-shrink: 0;
  flex-basis: 0;
  max-width: 100%;
  min-width: 100px;
`;

export const Row = styled.div<RowProps>`
  display: flex;
  margin: 0 ${props => -(props.gutter || DEFAULT_GUTTER) / 2}px;
  flex-wrap: wrap;

  ${Col} {
    padding: 0 ${props => (props.gutter || DEFAULT_GUTTER) / 2}px;
  }
`;

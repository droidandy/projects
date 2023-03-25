import styled from 'styled-components';

export const Row = styled.div`
  max-width: 100%;
  display: flex;
  margin: 0 -15px;
  flex-wrap: wrap;
`;

export const Col = styled.div<{ grow?: number }>`
  width: 100%;
  padding: 0 15px;
  flex-grow: ${props => props.grow || 1};
  flex-shrink: 0;
  flex-basis: 0;
  max-width: 100%;
  min-width: 300px;
`;

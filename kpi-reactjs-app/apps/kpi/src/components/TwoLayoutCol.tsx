import * as React from 'react';
import styled, { css } from 'styled-components';
import { MOBILE } from 'src/common/utils';

interface TwoLayoutColProps {
  className?: string;
  col1: React.ReactNode;
  col2: React.ReactNode;
  col2Width?: number;
}

const Col = styled.div`
  > * {
    margin-bottom: 10px;
  }
`;

const Col1 = styled(Col)`
  flex: 1 0 0;
  min-width: 500px;
  ${MOBILE} {
    min-width: 0;
    width: 100%;
    flex-basis: 100%;
  }
`;
const Col2 = styled(Col)`
  flex: 0 0 300px;
  margin-left: 20px;
  ${MOBILE} {
    margin-left: 0;
    width: 100%;
    flex-basis: 100%;
  }
`;

const _TwoLayoutCol = (props: TwoLayoutColProps) => {
  const { className, col1, col2 } = props;
  return (
    <div className={className}>
      <Col1>{col1}</Col1>
      <Col2>{col2}</Col2>
    </div>
  );
};

export const TwoLayoutCol = styled(_TwoLayoutCol)`
  display: flex;
  margin-top: 20px;
  flex-wrap: wrap;
  width: 100%;
  ${props =>
    props.col2Width &&
    css`
      ${Col2} {
        flex-basis: ${props.col2Width}px;
      }
    `}
`;

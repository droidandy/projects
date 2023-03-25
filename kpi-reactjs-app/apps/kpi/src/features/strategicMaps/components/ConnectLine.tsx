import * as React from 'react';
import * as R from 'remeda';
import styled from 'styled-components';

export const LINE_COLOR = '#ccc';

interface ConnectLineProps {
  className?: string;
  size: number;
}

const CenterLine = styled.div`
  width: 1px;
  height: 10px;
  background: ${LINE_COLOR};
  left: calc(50% - 1px);
  bottom: 0;
  position: absolute;
`;

const Line = styled.div`
  width: 1px;
  height: 10px;
  background: ${LINE_COLOR};
  left: 50%;
  bottom: -25px;
  position: absolute;
`;

const LineWrapper = styled.div`
  position: relative;
  margin: 5px;
`;

const _ConnectLine = (props: ConnectLineProps) => {
  const { className, size } = props;
  return (
    <>
      <LinesWrapper>
        {R.range(0, size).map(i => (
          <LineWrapper key={i} style={{ width: `calc(${100 / size}% - 10px)` }}>
            <Line />
          </LineWrapper>
        ))}
      </LinesWrapper>
      <div className={className} style={{ width: '100%' }}>
        <CenterLine />
      </div>
    </>
  );
};

export const ConnectLine = styled(_ConnectLine)`
  border-bottom: 1px solid ${LINE_COLOR};
  position: relative;
  margin: 10px auto 15px;
  visibility: ${props => (props.size ? undefined : 'hidden')};
`;

const LinesWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

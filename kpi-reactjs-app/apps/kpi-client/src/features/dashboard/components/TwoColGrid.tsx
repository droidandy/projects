import * as React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'src/components/Grid';

interface TwoColGridProps {
  className?: string;
  children: [React.ReactChild, React.ReactChild];
}

const _TwoColGrid = (props: TwoColGridProps) => {
  const { className, children } = props;
  const [child1, child2] = children;
  return (
    <div className={className}>
      <Row>
        <Col>{child1}</Col>
        <Col>{child2}</Col>
      </Row>
    </div>
  );
};

export const TwoColGrid = styled(_TwoColGrid)`
  display: block;
  margin-top: 35px;
  margin-bottom: 20px;
`;

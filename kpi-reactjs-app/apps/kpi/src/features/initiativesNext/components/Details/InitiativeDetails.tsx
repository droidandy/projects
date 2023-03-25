import * as React from 'react';
import styled from 'styled-components';
import { InitiativeInfo } from './InitiativeInfo';
import { Row, Col } from 'src/components/Grid';
import { ProjectOutcome } from './ProjectOutcome';
import { SideInfo } from './SideInfo';
import { Activities } from './Activities';
import { Portlet } from 'src/components/Portlet';
import { RiskManagement } from './RiskManagement';
import { RelatedItems } from './RelatedItems';

interface InitiativeDetailsProps {
  className?: string;
}

const Col1 = styled(Col)`
  width: calc(100% - 300px);
`;

const Col2 = styled(Col)`
  width: 300px;
  flex-grow: 0;
`;

const _InitiativeDetails = (props: InitiativeDetailsProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <Row>
        <Col>
          <InitiativeInfo />
        </Col>
      </Row>
      <Row>
        <Col1>
          <ProjectOutcome />
        </Col1>
        <Col2>
          <SideInfo />
        </Col2>
      </Row>
      <Row>
        <Col1>
          <Activities />
        </Col1>
        <Col2>
          <RelatedItems />
        </Col2>
      </Row>
      <Row>
        <Col>
          <RiskManagement />
        </Col>
      </Row>
    </div>
  );
};

export const InitiativeDetails = styled(_InitiativeDetails)`
  display: block;
  min-height: 100%;
  overflow: auto;
  ${Row} {
    margin-bottom: 30px;
    ${Portlet} {
      margin: 0;
    }
  }
`;

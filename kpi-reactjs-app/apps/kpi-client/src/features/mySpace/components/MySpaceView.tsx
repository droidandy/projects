import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'src/components/Grid';
import { LinkBox } from './LinkBox';
import { InitiativesIcon } from './InitiativesIcon';
import { ScorecardIcon } from './ScorecardIcon';
import { ExcellenceIcon } from './ExcellenceIcon';
import { DataEntryIcon } from './DataEntryIcon';
import { ReportsIcon } from './ReportsIcon';
import { Container } from 'src/components/Container';
import { MyTasksWidget } from './MyTasksWidget';
import { AlertsWidget } from './AlertsWidget';
import { EducationalContentsWidgets } from './EducationalContentsWidgets';

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: #244159;
  margin-top: 25px;
  margin-bottom: 65px;
`;

const Separator = styled.div`
  margin: 30px 0;
  height: 1px;
  width: 100%;
  background: rgba(218, 231, 242, 0.6);
`;

export const MySpaceView = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Container>
        <Title>{t('My Space')}</Title>
        <Row gutter={20}>
          <Col>
            <LinkBox
              url="/reports"
              title={t('Reports')}
              text={t('Shows all the information about the Reports')}
              icon={<ReportsIcon />}
            />
          </Col>
          <Col>
            <LinkBox
              url="/data-entry"
              title={t('KPIs and Data Entry')}
              text={t('Shows all the information about the Data Entry')}
              icon={<DataEntryIcon />}
            />
          </Col>
          <Col>
            <LinkBox
              url="/my-kpis"
              title={t('My KPIs')}
              text={t('Shows all the information about the My KPIs')}
              icon={<DataEntryIcon />}
            />
          </Col>
          <Col>
            <LinkBox
              url="/bsc"
              title={t('Scorecard')}
              text={t('Shows all the information about the Scorecard')}
              icon={<ScorecardIcon />}
            />
          </Col>
          <Col>
            <LinkBox
              url="/excellence"
              title={t('Excellence')}
              text={t('Shows all the information about the Excellence')}
              icon={<ExcellenceIcon />}
            />
          </Col>
          <Col>
            <LinkBox
              url="/projects/listing"
              title={t('Initiatives')}
              text={t('Shows all the information about the Initiatives')}
              icon={<InitiativesIcon />}
            />
          </Col>
        </Row>
        <Separator />
        <Row>
          <Col>
            <EducationalContentsWidgets />
          </Col>
          <Col>
            <MyTasksWidget />
          </Col>
          <Col>
            <AlertsWidget />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

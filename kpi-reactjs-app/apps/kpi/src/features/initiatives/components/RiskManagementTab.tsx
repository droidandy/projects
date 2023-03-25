import React from 'react';
import { TableScroll } from 'src/components/TableScroll';
import { Table, Th, Td } from 'src/components/Table';
import { useTranslation } from 'react-i18next';
import { getInitiativesState } from '../interface';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { Button } from 'src/components/Button';
import styled from 'styled-components';
import {
  RiskManagementModal,
  RiskManagementActions,
} from './RiskManagementModal';
import { useActions } from 'typeless';
import { Link } from 'src/components/Link';

const ButtonWrapper = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
`;

export function RiskManagementTab() {
  const { t } = useTranslation();
  const { risks } = getInitiativesState.useState();
  const { show: showDetails } = useActions(RiskManagementActions);

  return (
    <div>
      <RiskManagementModal />
      <ButtonWrapper>
        <Button small onClick={() => showDetails(null)}>
          {t('Add')}
        </Button>
      </ButtonWrapper>
      <TableScroll>
        <Table>
          <thead>
            <tr>
              <Th>{t('Linked Initiative')}</Th>
              <Th>{t('Influence')}</Th>
              <Th>{t('Potential Risk')}</Th>
              <Th>{t('Possibility')}</Th>
              <Th>{t('Impact')}</Th>
              <Th>{t('Risk Index')}</Th>
              <Th>{t('Counter Measure')}</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {risks.map(item => (
              <tr key={item.id}>
                <Td>
                  <DisplayTransString value={item.linkedInitiative.name} />
                </Td>
                <Td>{item.influence}</Td>
                <Td>{item.potentialRiskDesc}</Td>
                <Td>{item.possibility}</Td>
                <Td>{item.impact}</Td>
                <Td>{item.riskIndex}</Td>
                <Td>{item.counterMeasure}</Td>
                <Td>
                  <Link onClick={() => showDetails(item)}>{t('Edit')}</Link>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableScroll>
    </div>
  );
}

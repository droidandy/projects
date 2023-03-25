import React from 'react';
import { Portlet } from 'src/components/Portlet';
import { useTranslation } from 'react-i18next';
import { Table, Th, Td } from 'src/components/Table';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { useActions } from 'typeless';
import { Link } from 'typeless-router';
import { Button } from 'src/components/Button';
import { getInitiativesState } from '../../interface';
import { RiskManagementActions } from '../RiskManagementModal';

export function RiskManagement() {
  const { t } = useTranslation();
  const { show: showRisk } = useActions(RiskManagementActions);
  const { risks } = getInitiativesState.useState();

  return (
    <Portlet
      maxHeight
      padding
      title={t('Risk Management')}
      buttons={
        <Button small onClick={() => showRisk(null)}>
          {t('Add')}
        </Button>
      }
    >
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
          {risks.map(item => {
            return (
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
                  <Link onClick={() => showRisk(item)}>{t('View')}</Link>
                  {' | '}
                  <Link onClick={() => showRisk(item)}>{t('Edit')}</Link>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Portlet>
  );
}

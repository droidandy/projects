import { useTranslation } from 'react-i18next';
import { NoLabelItem } from 'src/components/NoLabelItem';
import React from 'react';
import { Td, Table, Th } from 'src/components/Table';
import { getInfoFormState, InfoFormActions } from '../../info-form';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { ConfirmDeleteLink } from 'src/components/ConfirmDeleteLink';
import { useActions } from 'typeless';
import { Link } from 'src/components/Link';
import { RiskManagementActions } from '../RiskManagementModal';

export function RisksTable() {
  const { t } = useTranslation();
  const { values } = getInfoFormState.useState();
  const { change } = useActions(InfoFormActions);
  const risks = values.risks || [];
  const { show: showRisk } = useActions(RiskManagementActions);
  return (
    <NoLabelItem>
      {risks.length > 0 && (
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
                    <Link onClick={() => showRisk(item)}>{t('Edit')}</Link>
                    {' | '}
                    <ConfirmDeleteLink
                      onYes={() => {
                        change(
                          'risks',
                          risks.filter(x => x.id !== item.id)
                        );
                      }}
                    />
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </NoLabelItem>
  );
}

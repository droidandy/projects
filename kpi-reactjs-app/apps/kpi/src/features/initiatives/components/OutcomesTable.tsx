import { useTranslation } from 'react-i18next';
import { NoLabelItem } from 'src/components/NoLabelItem';
import React from 'react';
import { Td, Table, Th } from 'src/components/Table';
import { useActions } from 'typeless';
import { getInfoFormState, InfoFormActions } from '../info-form';
import { getInitiativesState } from '../interface';
import { ConfirmDeleteLink } from 'src/components/ConfirmDeleteLink';

export function OutcomesTable() {
  const { t } = useTranslation();
  const { values } = getInfoFormState.useState();
  const { isEditing } = getInitiativesState.useState();
  const { change } = useActions(InfoFormActions);
  const outcomes = values.outcomes || [];
  return (
    <NoLabelItem>
      {outcomes.length > 0 && (
        <Table>
          <thead>
            <tr>
              <Th>{t('Outcome')}</Th>
              {isEditing && <Th></Th>}
            </tr>
          </thead>
          <tbody>
            {outcomes.map(id => {
              const prefix = `outcome_${id}_`;
              const value = values[prefix + 'value'];
              return (
                <tr key={id}>
                  <Td>{value}</Td>
                  {isEditing && (
                    <Td>
                      <ConfirmDeleteLink
                        onYes={() => {
                          change(
                            'outcomes',
                            outcomes.filter(x => x !== id)
                          );
                        }}
                      />
                    </Td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </NoLabelItem>
  );
}

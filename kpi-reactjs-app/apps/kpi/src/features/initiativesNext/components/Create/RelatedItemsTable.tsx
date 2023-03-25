import { useTranslation } from 'react-i18next';
import { NoLabelItem } from 'src/components/NoLabelItem';
import React from 'react';
import { Td, Table, Th } from 'src/components/Table';
import { getInfoFormState, InfoFormActions } from '../../info-form';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { ConfirmDeleteLink } from 'src/components/ConfirmDeleteLink';
import { useActions } from 'typeless';

export function RelatedItemsTable() {
  const { t } = useTranslation();
  const { values } = getInfoFormState.useState();
  const { change } = useActions(InfoFormActions);
  const relatedItems = values.relatedItems || [];
  return (
    <NoLabelItem>
      {relatedItems.length > 0 && (
        <Table>
          <thead>
            <tr>
              <Th>{t('Type')}</Th>
              <Th>{t('Name')}</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {relatedItems.map(item => {
              return (
                <tr key={item.id}>
                  <Td>{t(item.toObjectType)}</Td>
                  <Td>
                    <DisplayTransString value={item.toObjectTitle} />
                  </Td>
                  <Td>
                    <ConfirmDeleteLink
                      onYes={() => {
                        change(
                          'relatedItems',
                          relatedItems.filter(x => x.id !== item.id)
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

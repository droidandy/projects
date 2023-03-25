import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useActions } from 'typeless';
import { NoLabelItem } from 'src/components/NoLabelItem';
import { Table, Th, Td } from 'src/components/Table';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { Link } from 'src/components/Link';
import { ConfirmDeleteLink } from 'src/components/ConfirmDeleteLink';
import {
  ChallengeFormActions,
  getChallengeFormState,
  getActionProp,
} from '../challenge-form';
import { ActionDetailsActions } from 'src/features/actionDetails/interface';

export function ActionsTable() {
  const { t } = useTranslation();
  const { values } = getChallengeFormState.useState();
  const { change } = useActions(ChallengeFormActions);
  const { show } = useActions(ActionDetailsActions);
  const actions = values.actions || [];

  if (!actions.length) {
    return null;
  }

  return (
    <NoLabelItem>
      <Table>
        <thead>
          <tr>
            <Th>{t('Name')}</Th>
            <Th style={{ width: 200 }}></Th>
          </tr>
        </thead>
        <tbody>
          {actions.map(id => {
            const name = values[getActionProp(id, 'name')];
            const startDate = values[getActionProp(id, 'startDate')];
            const endDate = values[getActionProp(id, 'endDate')];
            return (
              <tr key={id}>
                <Td>
                  <DisplayTransString value={name} />
                </Td>
                <Td style={{ width: 200 }}>
                  <Link
                    onClick={() =>
                      show({
                        id,
                        name,
                        startDate,
                        endDate,
                      })
                    }
                  >
                    {t('View')}
                  </Link>
                  {' | '}
                  <ConfirmDeleteLink
                    onYes={() => {
                      change(
                        'actions',
                        actions.filter(x => x !== id)
                      );
                    }}
                  />
                </Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </NoLabelItem>
  );
}

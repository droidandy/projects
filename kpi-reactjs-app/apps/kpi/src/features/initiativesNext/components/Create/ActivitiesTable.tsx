import { useTranslation } from 'react-i18next';
import { NoLabelItem } from 'src/components/NoLabelItem';
import React from 'react';
import { Td, Table, Th } from 'src/components/Table';
import { getInfoFormState, InfoFormActions } from '../../info-form';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { formatDate } from 'src/common/utils';
import { ConfirmDeleteLink } from 'src/components/ConfirmDeleteLink';
import { useActions } from 'typeless';
import { Link } from 'src/components/Link';
import { ActivityActions } from '../ActivityModal';

export function ActivitiesTable() {
  const { t } = useTranslation();
  const { values } = getInfoFormState.useState();
  const { change } = useActions(InfoFormActions);
  const activities = values.activities || [];
  const { show: showActivity } = useActions(ActivityActions);
  return (
    <NoLabelItem>
      {activities.length > 0 && (
        <Table>
          <thead>
            <tr>
              <Th>{t('Name')}</Th>
              <Th>{t('Status')}</Th>
              <Th>{t('Start')}</Th>
              <Th>{t('Due')}</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {activities.map(activity => {
              return (
                <tr key={activity.id}>
                  <Td>
                    <DisplayTransString value={activity.name} />
                  </Td>
                  <Td>{activity.status}</Td>
                  <Td>{formatDate(activity.startDate)}</Td>
                  <Td>{formatDate(activity.endDate)}</Td>
                  <Td>
                    <Link onClick={() => showActivity(activity)}>
                      {t('Edit')}
                    </Link>
                    {' | '}
                    <ConfirmDeleteLink
                      onYes={() => {
                        change(
                          'activities',
                          activities.filter(x => x.id !== activity.id)
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

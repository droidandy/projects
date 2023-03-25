import React from 'react';
import { Portlet } from 'src/components/Portlet';
import { useTranslation } from 'react-i18next';
import { Table, Th, Td } from 'src/components/Table';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { formatDate } from 'src/common/utils';
import { ActivityActions } from '../ActivityModal';
import { useActions } from 'typeless';
import { Link } from 'typeless-router';
import { Button } from 'src/components/Button';
import { getInitiativesState } from '../../interface';
import { ViewActivityActions } from '../ViewActivityModal';

export function Activities() {
  const { t } = useTranslation();
  const { show: showActivity, showById: showActivityById } = useActions(
    ActivityActions
  );
  const { show: showViewActivity } = useActions(ViewActivityActions);
  const { activities } = getInitiativesState.useState();

  return (
    <Portlet
      maxHeight
      padding
      title={t('Activities')}
      buttons={
        <Button small onClick={() => showActivity(null)}>
          {t('Add')}
        </Button>
      }
    >
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
                  <Link onClick={() => showViewActivity(activity.id)}>
                    {t('View')}
                  </Link>
                  {' | '}
                  <Link onClick={() => showActivityById(activity.id)}>
                    {t('Edit')}
                  </Link>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Portlet>
  );
}

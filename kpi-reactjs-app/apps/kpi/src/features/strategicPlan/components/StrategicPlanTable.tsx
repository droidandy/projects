import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { NoLabelItem } from 'src/components/NoLabelItem';
import { Table, Th, Td } from 'src/components/Table';
import { getStrategicPlanState, StrategicPlanActions } from '../interface';
import { Trans } from 'react-i18next';
import { Link } from 'typeless-router';
import { useActions } from 'typeless';
import { StrategicPlanIconView } from 'src/components/StrategicPlanIconView';

export function StrategicPlanValuesTable() {
  const { t } = useTranslation();
  const { values } = getStrategicPlanState();
  const { deleteValue } = useActions(StrategicPlanActions);

  if (!values.length) {
    return null;
  }

  return (
    <NoLabelItem style={{ padding: 0 }}>
      <Table>
        <thead>
          <tr>
            <Th>{t('Value (En)')}</Th>
            <Th>{t('Value (Ar)')}</Th>
            <Th>{t('Icon')}</Th>
            <Th>{t('Actions')}</Th>
          </tr>
        </thead>
        <tbody>
          {values.map((item, index) => {
            return (
              <tr key={index}>
                <Td>{item.text ? item.text.en! : '-'}</Td>
                <Td>{item.text ? item.text.ar! : '-'}</Td>
                <Td>
                  {item.icon ? (
                    <StrategicPlanIconView
                      width={50}
                      height={50}
                      targetObject={item}
                    />
                  ) : (
                    '-'
                  )}
                </Td>
                <Td>
                  <Link onClick={() => deleteValue(item.id!)}>
                    <Trans>Delete</Trans>
                  </Link>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </NoLabelItem>
  );
}

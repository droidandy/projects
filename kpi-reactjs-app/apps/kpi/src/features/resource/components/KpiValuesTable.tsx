import * as React from 'react';
import styled from 'styled-components';
import { NoLabelItem } from '../../../components/NoLabelItem';
import { Table, Th, Td } from 'src/components/Table';
import { useTranslation } from 'react-i18next';
import { useScoringType } from '../hooks';
import { KPIScoringType } from 'src/types-next';
import { FormCheckbox } from 'src/components/FormCheckbox';
import { useActions } from 'typeless';
import {
  formatCalendarPeriod,
  getKPIPercent,
  formatKpiValue,
} from 'src/common/utils';
import { isKPIScoring4Colors } from 'src/common/helper';
import { ConfirmDeleteLink } from 'src/components/ConfirmDeleteLink';
import { getPeriodProp } from '../utils';
import { getResourceFormState, ResourceFormActions } from '../resource-form';
import { Link } from 'src/components/Link';
import { FormInput } from 'src/components/ReduxInput';

interface KpiValuesTableProps {
  className?: string;
  isEditing: boolean;
}

const _KpiValuesTable = (props: KpiValuesTableProps) => {
  const { className, isEditing } = props;
  const { values } = getResourceFormState.useState();
  const { t } = useTranslation();
  const scoringType = useScoringType();
  const { change: changeInfo } = useActions(ResourceFormActions);
  const [editingMap, setEditingMap] = React.useState(
    {} as {
      [x: string]: boolean;
    }
  );
  const periods = values.periods || [];
  if (!periods.length) {
    return null;
  }
  const { yellow, target, best, low, high } = values;
  const dataType = values.dataType ? Number(values.dataType.value) : 0;
  return (
    <div className={className}>
      <NoLabelItem>
        <Table>
          <thead>
            <tr>
              <Th>{t('Period')}</Th>
              {isKPIScoring4Colors(scoringType) && (
                <>
                  <Th>{t('Yellow')}</Th>
                  <Th>{t('Green')}</Th>
                  <Th>{t('Blue')}</Th>
                </>
              )}
              {KPIScoringType.Bounded === scoringType && (
                <>
                  <Th>{t('Low')}</Th>
                  <Th>{t('High')}</Th>
                </>
              )}
              <Th>{t('Target')}</Th>
              <Th>{t('aggregated')}</Th>
              {isEditing && <Th></Th>}
            </tr>
          </thead>
          <tbody>
            {periods.map(period => {
              const key = formatCalendarPeriod(period);
              const value = values[getPeriodProp(key, 'target')];
              const isCellEditing = editingMap[key];
              const getPercent = (n: number) =>
                formatKpiValue(getKPIPercent(n, value), dataType, true);

              const formatBounded = (n: number) => {
                if (n == null) {
                  return '';
                }
                return Math.round(value * (100 + Number(n))) / 100;
              };
              return (
                <tr key={key}>
                  <Td>{key}</Td>
                  {isKPIScoring4Colors(scoringType) && (
                    <>
                      <Td>{getPercent(yellow)}</Td>
                      <Td>{getPercent(target)}</Td>
                      <Td>{getPercent(best)}</Td>
                    </>
                  )}
                  {KPIScoringType.Bounded === scoringType && (
                    <>
                      <Td>{formatBounded(-low)}</Td>
                      <Td>{formatBounded(high)}</Td>
                    </>
                  )}
                  <Td>
                    {isCellEditing ? (
                      <FormInput
                        style={{ width: 100 }}
                        name={getPeriodProp(key, 'target')}
                      />
                    ) : (
                      formatKpiValue(value, dataType)
                    )}
                  </Td>
                  <Td>
                    <FormCheckbox
                      name={getPeriodProp(key, 'aggregated')}
                      readOnlyText={!isEditing}
                    >
                      &nbsp;
                    </FormCheckbox>
                  </Td>
                  {isEditing && (
                    <td style={{ width: 120 }}>
                      <ConfirmDeleteLink
                        onYes={() => {
                          changeInfo(
                            'periods',
                            periods.filter(x => x !== period)
                          );
                        }}
                      />
                      {' | '}
                      <Link
                        onClick={() => {
                          setEditingMap({
                            ...editingMap,
                            [key]: !isCellEditing,
                          });
                        }}
                      >
                        {t(isCellEditing ? 'Save' : 'Edit')}
                      </Link>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </NoLabelItem>
    </div>
  );
};

export const KpiValuesTable = styled(_KpiValuesTable)`
  display: block;
`;

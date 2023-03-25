import React from 'react';
import * as R from 'remeda';
import { getMyKpisState, MyKpisActions } from '../interface';
import { useTranslation } from 'react-i18next';
import { TableView } from 'src/components/TableView';
import { UnitAccordion } from 'src/components/UnitAccordion';
import { getGlobalState } from 'src/features/global/interface';
import { MyKpiTableColumns } from './MyKpiTableColumns';
import { MyKpiRow } from './MyKpiRow';
import { KpiDetailsSidePanel } from 'src/features/kpiDetails/components/KpiDetailsSidePanel';
import { FilterToggle } from '../../../components/FilterToggle';
import { MyKpiFilter } from './MyKpiFilter';
import { useLanguage } from 'src/hooks/useLanguage';
import { useActions } from 'typeless';
import { Button } from 'src/components/Button';
import styled from 'styled-components';

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  > ${Button} {
    margin-left: 30px;
  }
`;

export function MyKpisView() {
  const { t } = useTranslation();
  const {
    items,
    isLoading,
    filter,
    isFilterExpanded,
  } = getMyKpisState.useState();
  const { lookups, kpiLevels } = getGlobalState.useState();
  const { setIsFilterExpanded } = useActions(MyKpisActions);
  const lang = useLanguage();

  const lookupMap = React.useMemo(() => R.indexBy(lookups, x => x.id), [
    lookups,
  ]);
  const levelMap = React.useMemo(() => R.indexBy(kpiLevels, x => x.id), [
    kpiLevels,
  ]);

  const filtered = React.useMemo(() => {
    return items
      .map(group => {
        return {
          ...group,
          items: group.items.filter(item => {
            if (filter.aggregation) {
              if (item.kpi.aggregationType !== filter.aggregation.value) {
                return false;
              }
            }
            if (filter.scoringType) {
              if (item.kpi.scoringTypeId !== filter.scoringType.value) {
                return false;
              }
            }
            if (filter.level) {
              if (item.kpi.kpiLevelId !== filter.level.value) {
                return false;
              }
            }
            if (filter.frequency) {
              if (item.kpi.periodFrequency !== filter.frequency.value) {
                return false;
              }
            }
            if (filter.status) {
              if (item.kpi.status !== filter.status.value) {
                return false;
              }
            }
            if (filter.kpiCode.trim()) {
              if (
                !(item.kpi.kpiCode || '')
                  .toLowerCase()
                  .includes(filter.kpiCode.trim().toLowerCase())
              ) {
                return false;
              }
            }
            if (filter.kpiName.trim()) {
              if (
                !(item.kpi.name[lang] || '')
                  .toLowerCase()
                  .includes(filter.kpiName.trim().toLowerCase())
              ) {
                return false;
              }
            }

            return true;
          }),
        };
      })
      .filter(group => group.items.length > 0);
  }, [items, filter, lang]);

  return (
    <>
      <KpiDetailsSidePanel />
      <TableView
        flex
        title={t('My KPIs')}
        titleAppend={
          <TitleWrapper>
            <Button href="/create-kpi" styling="primary">
              + {t('Create New KPI')}
            </Button>
            <FilterToggle
              isFilterExpanded={isFilterExpanded}
              setIsFilterExpanded={setIsFilterExpanded}
            />
          </TitleWrapper>
        }
        header={
          <>
            <MyKpiFilter />
            <MyKpiTableColumns />
          </>
        }
        isLoading={isLoading}
      >
        {filtered.map(group => (
          <UnitAccordion unit={group.unit} key={group.unit.id}>
            {group.items.map(item => (
              <MyKpiRow
                key={item.kpi.id}
                item={item}
                lookupMap={lookupMap}
                levelMap={levelMap}
              />
            ))}
          </UnitAccordion>
        ))}
      </TableView>
    </>
  );
}

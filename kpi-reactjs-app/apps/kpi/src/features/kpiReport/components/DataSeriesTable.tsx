import { ObjectPerformance, KPISeriesReportItem } from 'src/types-next';
import React from 'react';
import { getKpiReportState, KpiReportActions } from '../interface';
import { Column, DataTable } from 'src/components/DataTable';
import { Link } from 'src/components/Link';
import { ActualInput } from './ActualInput';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { formatKpiValue } from 'src/common/utils';
import { PerformanceColor } from 'src/components/PerformanceColor';
import { ItemCommentsButton } from 'src/features/unitReport/components/ItemCommentsButton';
import { useLookupMap } from 'src/hooks/useLookupMap';
import { Evidences } from 'src/features/unitReport/components/Evidences';
import { useActions } from 'typeless';

export interface DataSeriesTableProps {
  isReadOnly: boolean;
}

function formatPerformance(performance: ObjectPerformance | undefined) {
  if (!performance || !performance.performance) {
    return '-';
  }
  return Math.round(performance.performance * 100) / 100 + '%';
}

function getYearlyPerformance(dataSeries: KPISeriesReportItem) {
  const performance = dataSeries.performances.find(x => x.progressAggregation);
  return formatPerformance(performance);
}

export function DataSeriesTable(props: DataSeriesTableProps) {
  const { isReadOnly } = props;
  const { kpiReport } = getKpiReportState.useState();
  const lookupMap = useLookupMap();
  const { uploadFile } = useActions(KpiReportActions);

  const columns: Array<Column<KPISeriesReportItem>> = [
    {
      name: 'name',
      displayName: 'KPI Name',
      sortable: true,
      renderCell: item => (
        <Link href={`/scorecards/KPI/${item.kpiDataSeries.kpiId}?full=true`}>
          <DisplayTransString value={item.kpiDataSeries.kpi!.name} />
        </Link>
      ),
    },
    {
      name: 'type',
      displayName: 'Type',
      renderCell: item => (
        <DisplayTransString
          value={lookupMap[item.kpiDataSeries.kpi!.scoringTypeId]}
        />
      ),
    },
    {
      name: 'target',
      displayName: 'Target',
      renderCell: item =>
        formatKpiValue(
          item.kpiDataSeries.target,
          item.kpiDataSeries.kpi!.dataTypeId
        ),
    },
    {
      name: 'actual',
      displayName: 'Actual',
      renderCell: item =>
        isReadOnly ? (
          item.kpiDataSeries.value
        ) : (
          <ActualInput
            kpiDataSeriesId={item.kpiDataSeriesId}
            value={item.kpiDataSeries.value}
          />
        ),
    },
    {
      name: 'performance',
      displayName: 'Performance',
      renderCell: item => {
        const performance = item.performances.find(x => !x.progressAggregation);
        const value = formatPerformance(performance);
        if (value === '-') {
          return value;
        }
        return (
          <PerformanceColor color={performance!.performanceColor.slug}>
            {value}
          </PerformanceColor>
        );
      },
    },
    {
      name: 'yearlyProgress',
      displayName: 'Yearly Progress',
      renderCell: item => getYearlyPerformance(item),
    },
    {
      name: 'comments',
      displayName: 'Comments',
      renderCell: item => {
        return (
          <ItemCommentsButton
            type="KPISeries"
            unitReportId={kpiReport.unitReportId}
            itemId={item.id}
            comments={item.comments}
          />
        );
      },
    },
    {
      name: 'evidences',
      displayName: 'Evidences',
      renderCell: item => {
        return (
          <Evidences
            evidences={item.kpiDataSeries.kpi!.evidences}
            upload={file => {
              uploadFile(item.kpiDataSeries.kpiId!, file);
            }}
          />
        );
      },
    },
  ];

  return (
    <DataTable<KPISeriesReportItem>
      sortBy={'id'}
      sortDesc
      isLoading={false}
      items={kpiReport.reportItems}
      columns={columns}
      pageSize={0}
      pageNumber={0}
      total={0}
      noPagination
      search={() => {
        //
      }}
    />
  );
}

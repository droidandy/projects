import * as React from 'react';
import styled from 'styled-components';
import { UserKpiReportItem } from 'src/types';
import { TableRow } from './TableRow';
import { PerformanceBar } from '../../../components/PerformanceBar';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { getGlobalState } from 'src/features/global/interface';
import { FileIcon } from 'src/components/FileIcon';
import { CommentIcon } from 'src/components/CommentIcon';
import { ActualValue } from './ActualValue';
import { useActions } from 'typeless';
import { DataEntryActions } from '../interface';
import { roundTo2 } from 'src/common/utils';
import { CommentsActions } from 'src/features/comments/interface';
import { AttachmentsActions } from 'src/features/attachments/interface';
import { useTranslation } from 'react-i18next';
import { Status } from 'src/components/Status';

interface KpiRowProps {
  className?: string;
  item: UserKpiReportItem;
  isSubmitter?: boolean;
  isReportActive?: boolean;
}

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icons = styled(Center)`
  a {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  svg {
    margin: 0 5px;
  }
`;

const _KpiRow = (props: KpiRowProps) => {
  const { className, item, isSubmitter, isReportActive } = props;
  const { t } = useTranslation();
  const { lookups } = getGlobalState.useState();
  const kpi = item.kpi;
  const type = React.useMemo(() => {
    return lookups.find(x => x.id === kpi.scoringTypeId);
  }, [kpi]);
  const { show: showComments } = useActions(CommentsActions);
  const { show: showAttachments } = useActions(AttachmentsActions);
  const { updateActualValue } = useActions(DataEntryActions);
  const dataSeries = item.items[0]?.kpiDataSeries;
  const performance = item.items[0]?.performance;
  const yearlyProgress = item.items[0]?.yearlyProgress;

  return (
    <TableRow className={className}>
      {/* KPI Name */}
      <div>
        <strong>
          <DisplayTransString value={kpi.name} />
        </strong>
      </div>
      {/* Type */}
      <Center>
        <DisplayTransString value={type} />
      </Center>
      {/* Frequency */}
      <Center>{t(kpi.periodFrequency)}</Center>
      {/* Target */}
      <Center>{dataSeries ? dataSeries.target : '-'}</Center>
      {/* Actual */}
      {dataSeries ? (
        <Center>
          {isSubmitter || !isReportActive ? (
            <ActualValue
              value={dataSeries.value}
              onChange={value => {
                updateActualValue(dataSeries, value);
              }}
            />
          ) : (
            dataSeries.value
          )}
        </Center>
      ) : (
        <Center>-</Center>
      )}
      {/* Performance */}
      <Center>
        {performance ? (
          <PerformanceBar color={performance.performanceColor.slug}>
            {roundTo2(performance.performance)}%
          </PerformanceBar>
        ) : (
          '-'
        )}
      </Center>
      {/* Yearly Progress */}
      <Center>
        {yearlyProgress ? roundTo2(yearlyProgress.performance) + '%' : '-'}
      </Center>
      {/* Status */}
      {isReportActive && isSubmitter && (
        <Center>
          {performance?.performance ? (
            <Status status="ok">{t('Ready to submit')}</Status>
          ) : (
            <Status status="error">{t('Pending data')}</Status>
          )}
        </Center>
      )}
      {/* Evidences */}
      <Icons>
        {dataSeries && (
          <>
            <a
              onClick={() =>
                showAttachments(kpi, {
                  kpiDataSeriesId: dataSeries.id,
                })
              }
            >
              <FileIcon />
            </a>
            <a
              onClick={() =>
                showComments(kpi, {
                  kpiDataSeriesId: dataSeries.id,
                })
              }
            >
              <CommentIcon />
            </a>
          </>
        )}
      </Icons>
    </TableRow>
  );
};

export const KpiRow = styled(_KpiRow)`
  /* display: block; */
`;

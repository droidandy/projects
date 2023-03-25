import { ExcellenceReportItem } from 'src/types-next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Column, DataTable } from 'src/components/DataTable';
import { Link } from 'src/components/Link';
import { Badge } from 'src/components/Badge';
import { DisplayTransString } from 'src/components/DisplayTransString';
import {
  getExcellenceReportState,
  ExcellenceReportActions,
} from '../interface';
import { useActions } from 'typeless';
import { booleanOptions, requirementStatusOptions } from 'src/common/options';
import { Select } from 'src/components/Select';
import { ItemCommentsButton } from 'src/features/unitReport/components/ItemCommentsButton';
import { Evidences } from 'src/features/unitReport/components/Evidences';

export interface ExcellenceItemTableProps {
  isReadOnly: boolean;
}

export function ExcellenceItemTable(props: ExcellenceItemTableProps) {
  const { isReadOnly } = props;
  const { excellenceReport, unitReport } = getExcellenceReportState.useState();
  const { updateExcellenceItem, uploadFile } = useActions(
    ExcellenceReportActions
  );
  const { t } = useTranslation();
  const formatBool = (bool: boolean) => (bool ? t('Yes') : t('No'));

  const columns: Array<Column<ExcellenceReportItem>> = [
    {
      name: 'name',
      displayName: 'Excellence Name',
      sortable: true,
      renderCell: item => (
        <Link href={`/excellence`}>
          <DisplayTransString value={item.excellenceRequirement.name} />
        </Link>
      ),
    },
    {
      name: 'exist',
      displayName: 'exist?',
      renderCell: item =>
        isReadOnly ? (
          formatBool(item.excellenceRequirement.requirementStatus === 'Exist')
        ) : (
          <Select
            value={requirementStatusOptions.find(
              x => x.value === item.excellenceRequirement.requirementStatus
            )}
            options={requirementStatusOptions}
            onChange={(opt: any) =>
              updateExcellenceItem(item.id, {
                requirementStatus: opt.value,
              })
            }
          />
        ),
    },
    {
      name: 'isActive',
      displayName: 'Active?',
      renderCell: item =>
        isReadOnly ? (
          formatBool(item.excellenceRequirement.isEnabled)
        ) : (
          <Select
            value={booleanOptions.find(
              x => x.value === item.excellenceRequirement.isEnabled
            )}
            options={booleanOptions}
            isDisabled={
              item.excellenceRequirement.requirementStatus === 'NotExist'
            }
            onChange={(opt: any) =>
              updateExcellenceItem(item.id, {
                isEnabled: opt.value,
              })
            }
          />
        ),
    },
    {
      name: 'isCompleted',
      displayName: 'Completed?',
      renderCell: item =>
        isReadOnly ? (
          formatBool(item.excellenceRequirement.isCompleted)
        ) : (
          <Select
            value={booleanOptions.find(
              x => x.value === item.excellenceRequirement.isCompleted
            )}
            options={booleanOptions}
            isDisabled={!item.excellenceRequirement.isEnabled}
            onChange={(opt: any) =>
              updateExcellenceItem(item.id, {
                isCompleted: opt.value,
              })
            }
          />
        ),
    },
    {
      name: 'status',
      displayName: 'Status',
      renderCell: item => (
        <Badge
          type={
            item.excellenceRequirement.isCompleted
              ? 'success'
              : item.excellenceRequirement.isEnabled
              ? 'warning'
              : 'error'
          }
        >
          &nbsp; &nbsp; &nbsp; &nbsp;
        </Badge>
      ),
    },
    {
      name: 'comments',
      displayName: 'Comments',
      renderCell: item => {
        return (
          <ItemCommentsButton
            type="Excellence"
            unitReportId={unitReport.id}
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
            evidences={item.excellenceRequirement.evidences}
            upload={file => {
              uploadFile(item.excellenceRequirementId, file);
            }}
          />
        );
      },
    },
  ];

  return (
    <DataTable<ExcellenceReportItem>
      sortBy={'id'}
      sortDesc
      isLoading={false}
      items={excellenceReport.reportItems}
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

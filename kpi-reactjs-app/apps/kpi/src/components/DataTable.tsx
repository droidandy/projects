import * as React from 'react';
import styled from 'styled-components';
import { Pagination } from './Pagination';
import { Dropdown } from './Dropdown';
import { Trans } from 'react-i18next';
import { Spinner } from './Spinner';
import { SearchOptions, PermissionMap, Permission } from 'src/types';
import { rtlMargin, rtlTextLeft } from 'shared/rtl';
import { Link } from 'src/components/Link';
import { ConfirmDeleteLink } from './ConfirmDeleteLink';

export interface Column<T> {
  width?: number;
  name: string;
  displayName: string;
  sortable?: boolean;
  renderCell: (item: T) => React.ReactNode;
  hide?: () => boolean;
}

interface DataTableProps<T> {
  className?: string;
  columns: Array<Column<T>>;
  items: T[];
  total: number;
  isLoading: boolean;
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDesc: boolean;
  search: (options: SearchOptions) => any;
  noPagination?: boolean;
}

const Table = styled.table`
  width: 100%;
`;

interface ThProps {
  sortable?: boolean;
  sortableActive?: boolean;
}
const Th = styled.th<ThProps>`
  ${rtlTextLeft()}
  padding: 16px 20px;
  border-bottom: 1px solid #f0f3ff;
  ${props =>
    props.sortable &&
    `
    cursor: pointer;
  `}
  ${props =>
    props.sortableActive &&
    `
  color: #5d78ff;
  vertical-align: middle;
  `}

  i {
    font-size: 0.6rem;
    margin-left: 10px;
  }
`;
const Td = styled.td`
  ${rtlTextLeft()}
  padding: 16px 20px;
  border-bottom: 1px solid #f0f3ff;
  min-width: 120px;
`;

const Bottom = styled.div`
  padding: 15px 20px;
  display: flex;
`;

const PageWrapper = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
`;

const Wrapper = styled.div`
  position: relative;
  overflow-x: auto;
`;

const SpinnerWrapper = styled.div`
  position: absolute;
  top: 30%;
  left: calc(50% - 20px);
  z-index: 2;
`;

const RangeText = styled.span`
  ${rtlMargin('10px', 0)}
`;

export function DataTable<T>(props: DataTableProps<T>) {
  const {
    className,
    columns,
    items,
    total,
    isLoading,
    search,
    pageNumber,
    pageSize,
    sortBy,
    sortDesc,
    noPagination,
  } = props;

  const range = `${pageNumber * pageSize + 1}-${Math.min(
    total,
    (pageNumber + 1) * pageSize
  )}`;

  const visibleColumns = columns.filter(c => !c.hide || !c.hide());

  const partialSearch = (options: Partial<SearchOptions>) => {
    search({
      pageNumber,
      pageSize,
      sortBy,
      sortDesc,
      ...options,
    });
  };

  return (
    <Wrapper className={className}>
      {isLoading && (
        <SpinnerWrapper>
          <Spinner size={'40px'} black />
        </SpinnerWrapper>
      )}
      <Table style={{ opacity: isLoading ? 0.3 : 1 }}>
        <thead>
          <tr>
            {visibleColumns.map(col => (
              <Th
                key={col.name}
                sortable={col.sortable}
                sortableActive={col.name === sortBy}
                style={col.width ? { width: col.width, minWidth: 0 } : {}}
                onClick={() => {
                  if (col.sortable) {
                    partialSearch({
                      sortBy: col.name,
                      sortDesc: col.name === sortBy ? !sortDesc : false,
                    });
                  }
                }}
              >
                <Trans>{col.displayName}</Trans>
                {col.sortable && col.name === sortBy && (
                  <i
                    className={
                      sortDesc ? 'flaticon2-arrow-down' : 'flaticon2-arrow-up'
                    }
                  />
                )}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              {visibleColumns.map(col => (
                <Td
                  key={col.name}
                  style={col.width ? { width: col.width, minWidth: 0 } : {}}
                >
                  {col.renderCell(item)}
                </Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      {!noPagination && (
        <Bottom>
          <Pagination
            total={total}
            current={pageNumber}
            pageSize={pageSize}
            gotoPage={page => {
              partialSearch({
                pageNumber: page,
              });
            }}
          />
          <PageWrapper>
            <Dropdown
              value={pageSize}
              options={[
                { text: '10', value: 10 },
                { text: '20', value: 20 },
                { text: '30', value: 30 },
                { text: '50', value: 50 },
                { text: '100', value: 100 },
              ]}
              onChange={option => {
                partialSearch({
                  pageSize: option.value as number,
                  pageNumber: 0,
                });
              }}
            />
            <RangeText>
              <Trans i18nKey="showing_of">
                Showing {range} of {total}
              </Trans>
            </RangeText>
          </PageWrapper>
        </Bottom>
      )}
    </Wrapper>
  );
}

interface CRUDActionsColumnOptions<TItem> {
  permissionMap: PermissionMap;
  view: Permission;
  edit?: Permission;
  remove?: Permission;
  viewLink?: (item: TItem) => string;
  editLink?: (item: TItem) => string;
  onView?: (item: TItem) => void;
  onEdit?: (item: TItem) => void;
  onRemove?: (item: TItem) => void;
}

export function createCRUDActionsColumn<TItem>(
  options: CRUDActionsColumnOptions<TItem>
): Column<TItem> {
  const {
    permissionMap,
    view,
    edit,
    remove,
    onView,
    onEdit,
    onRemove,
    viewLink,
    editLink,
  } = options;
  return {
    name: 'actions',
    displayName: 'Actions',
    width: 200,
    hide: () =>
      !permissionMap[view] &&
      (!edit || !permissionMap[edit]) &&
      (!remove || !permissionMap[remove]),
    renderCell: item => {
      const actions: JSX.Element[] = [];
      if (permissionMap[view]) {
        actions.push(
          <Link
            onClick={onView && (() => onView(item))}
            href={viewLink && viewLink(item)}
          >
            <Trans>View</Trans>
          </Link>
        );
      }
      if (edit && permissionMap[edit]) {
        actions.push(
          <Link
            onClick={onEdit && (() => onEdit(item))}
            href={editLink && editLink(item)}
          >
            <Trans>Edit</Trans>
          </Link>
        );
      }
      if (onRemove && remove && permissionMap[remove]) {
        actions.push(<ConfirmDeleteLink onYes={() => onRemove(item)} />);
      }

      return (
        <>
          {actions.map((action, i) => (
            <React.Fragment key={i}>
              {action} {i !== actions.length - 1 && ' | '}
            </React.Fragment>
          ))}
        </>
      );
    },
  };
}

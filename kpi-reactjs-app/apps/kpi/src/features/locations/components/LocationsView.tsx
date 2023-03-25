import React from 'react';
import { Portlet } from 'src/components/Portlet';
import { Page } from 'src/components/Page';
import { DataTable, Column } from 'src/components/DataTable';
import { Location } from 'src/types';
import { getLocationsState, LocationsActions } from '../interface';
import { useActions } from 'typeless';
import { LocationsFilter } from './LocationsFilter';
import { useLanguage } from 'src/hooks/useLanguage';
import { Trans } from 'react-i18next';
import { Link } from 'typeless-router';
import { ActionButtons } from 'src/components/ActionButtons';
import { AddButton } from 'src/components/AddButton';
import { ExportButton } from 'src/components/ExportButton';
import { OnPermission } from 'src/components/OnPermission';
import { getGlobalState } from 'src/features/global/interface';

export const LocationsView = () => {
  const {
    isLoading,
    sortDesc,
    sortBy,
    items,
    total,
    pageNumber,
    pageSize,
  } = getLocationsState.useState();
  const { permissionMap } = getGlobalState.useState();
  const { search, onExport } = useActions(LocationsActions);
  const language = useLanguage();

  const columns: Array<Column<Location>> = [
    {
      name: 'name',
      displayName: 'Name',
      sortable: true,
      renderCell: item => item.name[language],
    },
    {
      name: 'address',
      displayName: 'Address',
      sortable: true,
      renderCell: item => item.address[language],
    },
    {
      name: 'poBox',
      displayName: 'P.O Box',
      sortable: true,
      renderCell: item => item.poBox,
    },
    {
      name: 'city',
      displayName: 'City',
      sortable: true,
      renderCell: item => item.city,
    },
    {
      name: 'country',
      displayName: 'Country',
      sortable: true,
      renderCell: item => item.country,
    },
    {
      name: 'isHeadquarter',
      displayName: 'Is Headquarter',
      sortable: true,
      renderCell: item => (item.isHeadquarter ? 'Yes' : 'No'),
    },
    {
      name: 'actions',
      displayName: 'Actions',
      width: 200,
      renderCell: item => {
        return (
          <div>
            <Link href={`/settings/locations/${item.id}`}>
              <Trans>View</Trans>
            </Link>
          </div>
        );
      },
    },
  ];
  if (!permissionMap['location:view']) {
    columns.pop();
  }

  return (
    <>
      <Page>
        <Portlet>
          <LocationsFilter />
          <ActionButtons>
            <OnPermission permission="location:add">
              <AddButton href="/settings/locations/new">Add Location</AddButton>
            </OnPermission>
            <OnPermission permission="locations:export">
              <ExportButton onClick={onExport} />
            </OnPermission>
          </ActionButtons>

          <DataTable<Location>
            sortBy={sortBy}
            sortDesc={sortDesc}
            isLoading={isLoading}
            items={items}
            columns={columns}
            pageSize={pageSize}
            pageNumber={pageNumber}
            total={total}
            search={search}
          />
        </Portlet>
      </Page>
    </>
  );
};

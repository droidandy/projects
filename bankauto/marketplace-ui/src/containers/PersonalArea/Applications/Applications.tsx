import React, { FC, useCallback, useEffect } from 'react';
import {
  SimpleCreditApplicationShort,
  InstalmentApplicationShort,
  VehicleApplicationShort,
  C2cApplicationShort,
  APPLICATION_CREDIT_STATUS,
  CreditType,
} from '@marketplace/ui-kit/types';
import { Box, CircularProgress } from '@marketplace/ui-kit';
import { ListItem } from '@marketplace/ui-modules';
// import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { StateModel } from 'store/types';
import { useApplicationsList } from 'store/profile/applications';
import { Title } from 'containers/PersonalArea/components';
import { Link } from 'components';
import { EmptyState } from 'components/EmptyState';
import { deactivatedStatusesForApplications } from 'constants/application';
import { ApplicationRejected } from './components';
import { useStyles } from './Applications.styles';

type ApplicationItem =
  | VehicleApplicationShort
  | InstalmentApplicationShort
  | C2cApplicationShort
  | SimpleCreditApplicationShort;

const APPLICATION_TYPE = {
  VEHICLE: 'mkpApplicationVehicle',
  INSTALMENT: 'mkpApplicationInstallment',
  CREDIT: 'mkpApplicationCredit',
  C2C: 'mkpApplicationC2c',
};

function getTypeItemMeta(item: ApplicationItem): { type: string; link: string | null } {
  if (item.instalment) {
    return {
      type: APPLICATION_TYPE.INSTALMENT,
      link:
        (item as InstalmentApplicationShort).vehicleData?.status &&
        deactivatedStatusesForApplications.includes((item as InstalmentApplicationShort).vehicleData!.status)
          ? '/car'
          : null,
    };
  } else if (item.simpleCredit) {
    return { type: APPLICATION_TYPE.CREDIT, link: null };
  } else if (item.c2c) {
    return { type: APPLICATION_TYPE.C2C, link: null };
  } else {
    return {
      type: APPLICATION_TYPE.VEHICLE,
      link:
        (item as VehicleApplicationShort).vehicleData?.status &&
        deactivatedStatusesForApplications.includes((item as VehicleApplicationShort).vehicleData!.status)
          ? '/car'
          : `/profile/applications/${item.uuid}`,
    };
  }
}

export const Applications: FC = () => {
  const s = useStyles();
  // const router = useRouter();
  const { items, loading, fetchApplicationsListItems } = useApplicationsList();
  const { isAuthorized } = useSelector((state: StateModel) => state.user);

  useEffect(() => {
    if (isAuthorized) fetchApplicationsListItems();
  }, [fetchApplicationsListItems, isAuthorized]);

  const getListItems = useCallback(
    () =>
      items.map((item: ApplicationItem, index: number) => {
        const { type, link } = getTypeItemMeta(item);

        return (
          <Box key={item.id} pt={index !== 0 ? 2.5 : 0}>
            {link ? (
              <Link href={link}>
                <ListItem type={type} deprecatedData={item} />
              </Link>
            ) : (
              <ListItem type={type} deprecatedData={item} />
            )}
          </Box>
        );
      }),
    [items],
  );

  if (!isAuthorized) return null;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%" width="100%" py={5}>
        <CircularProgress />
      </Box>
    );
  }

  // const handleRedirectToListing = () => {
  //   router.push('/car');
  // };

  const approved = items.filter((i) => i?.credit?.status === APPLICATION_CREDIT_STATUS.APPROVED);
  const refused = items.filter(
    (i) => i?.credit?.status === APPLICATION_CREDIT_STATUS.REFUSE && i?.credit?.type === CreditType.FIS,
  );
  const show = refused.length > 0 && approved.length === 0;

  return (
    <>
      <Title text="Заявки" />
      {items?.length ? (
        <>
          {show && <ApplicationRejected application={refused[0]} />}
          <Box>{getListItems()}</Box>
        </>
      ) : (
        <EmptyState
          classNames={{ container: s.container }}
          description="У Вас пока нет заявок"
          primaryAction={
            <Link href="#" variant="subtitle1" align="center">
              Найти автомобиль
            </Link>
          }
        />
      )}
    </>
  );
};

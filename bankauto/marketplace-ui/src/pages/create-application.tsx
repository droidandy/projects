import React, { FC, useEffect } from 'react';
import { APPLICATION_TYPE } from '@marketplace/ui-kit/types';
import { createSingleApplication } from 'api';
import { createInstalmentApplication } from 'api/application/instalment';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { StateModel } from 'store/types';
import { Pending } from 'helpers/pendings';
import { fireBookingAnalytics } from 'helpers/analytics';
import { actions as userActions } from 'store/user';
import { Meta } from 'components';
import { ContainerWrapper } from 'components/ContainerWrapper';
import { useRouteGuards } from 'hooks';
import { unauthorizedGuard } from 'guards';
import { MainLayout } from 'layouts';
import { SingleApplication } from 'types/SingleApplication';
import { CreateCreditApplicationParamsDTO } from 'dtos/CreateCreditApplicationParamsDTO';
import { CreateInstalmentApplicationParamsDTO } from 'dtos/CreateInstalmentApplicationParamsDTO';
import { MessageModalName } from 'types/MessageModal';
import { createCreditFisApplication } from 'api/application';
import { getCreateCreditFisParamsMapper } from 'api/mappers/creditFis';
import { LoaderProgress } from '../components/LoaderProgress';
import { CancellableAxiosPromise } from '../api/request';

type ApplicationData = SingleApplication | CreateCreditApplicationParamsDTO | CreateInstalmentApplicationParamsDTO;

type ApplicationTypeMap = Record<
  string,
  {
    createApplication: (data: ApplicationData) => CancellableAxiosPromise;
    urlPart: string;
    modalName: MessageModalName;
  }
>;

const APPLICATION_TYPE_MAP: ApplicationTypeMap = {
  [APPLICATION_TYPE.VEHICLE]: {
    createApplication: (data: ApplicationData) => createSingleApplication(data as SingleApplication),
    urlPart: 'applications',
    modalName: MessageModalName.APPLICATION_CREATED,
  },
  [APPLICATION_TYPE.INSTALMENT]: {
    createApplication: (data: ApplicationData) =>
      createInstalmentApplication(data as CreateInstalmentApplicationParamsDTO),
    urlPart: 'installment',
    modalName: MessageModalName.APPLICATION_INSTALMENT_CREATED,
  },
  [APPLICATION_TYPE.C2C]: {
    // Добавил временно, чтобы прошел билд
    createApplication: (data: ApplicationData) => createInstalmentApplication(data as CreateCreditApplicationParamsDTO),
    urlPart: 'installment',
    modalName: MessageModalName.APPLICATION_INSTALMENT_CREATED,
  },
};

const CreateApplication: FC = () => {
  useRouteGuards(unauthorizedGuard);

  const dispatch = useDispatch();
  const router = useRouter();
  const { callbackApplicationParams } = useSelector(({ user }: StateModel) => user);
  const { query } = router;
  const type = query.type as string;

  useEffect(() => {
    (async function () {
      if (!type) {
        return;
      }

      if (!callbackApplicationParams) {
        router.push('/profile/applications', '/profile/applications');
        return;
      }
      const { applicationParams, creditParams } = callbackApplicationParams;
      const { data } = await Pending(
        'create-application',
        APPLICATION_TYPE_MAP[type].createApplication(applicationParams),
      );
      if (creditParams) {
        await Pending(
          'create-credit-fis-application',
          createCreditFisApplication(getCreateCreditFisParamsMapper(data.uuid, creditParams)),
        );
      }
      dispatch(userActions.removeStoreApplicationParams());
      dispatch(userActions.removeOnAuthRedirect());
      if (type === APPLICATION_TYPE.VEHICLE) {
        fireBookingAnalytics({
          ...data,
          withCredit: (applicationParams as SingleApplication).withCredit,
          withTradeIn: (applicationParams as SingleApplication).withTradeIn,
        });
      }
      router.push(
        `/profile/${APPLICATION_TYPE_MAP[type].urlPart}/${(data as any).uuid}?modal=${
          APPLICATION_TYPE_MAP[type].modalName
        }&buttonTitle=Продолжить`,
      );
    })();
  }, []);

  return (
    <>
      <Meta />
      <MainLayout>
        <ContainerWrapper>
          <LoaderProgress />
        </ContainerWrapper>
      </MainLayout>
    </>
  );
};

export default CreateApplication;

import React, { FC, memo, useCallback, useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import {
  BackdropModal,
  Box,
  ContainerWrapper,
  Grid,
  HeroTitle,
  PageBackgroundWrapper,
  useBreakpoints,
} from '@marketplace/ui-kit';
import { APPLICATION_INSURANCE_STATUS, APPLICATION_INSURANCE_TYPE, Token } from '@marketplace/ui-kit/types';

import { SimpleModal } from 'components';
import { BreadcrumbsWrapper } from 'components/BreadcrumbsWrapper';
import { InsuranceFlow } from 'components/StaticCustomerFlow';

import { fireInsuranceSentAnalytics } from 'helpers/analytics';

import { actions } from 'store/insurance/application';
import { authorize } from 'store/user';
import { StateModel } from 'store/types';

import { InsuranceFormType, INSURANCE_PAYMENT } from 'types/Insurance';

import { InsuranceBuyBlock, InsuranceForm } from './components';
import { useStyles } from './Insurance.styles';

interface ModalData {
  title: string;
  subtitle: string;
  text: string;
}

const InsuranceHeader: FC = () => {
  const { isMobile } = useBreakpoints();
  const breadcrumbs = useMemo(
    () => [
      { to: '/', as: '/', label: 'Главная' },
      // { to: '/insurance', as: '/insurance', label: 'ОСАГО' },
      // { to: '/insurance/calculate', as: '/insurance/calculate', label: 'Расчет' },
    ],
    [],
  );
  const titleFraze = 'Оформите страховку';
  const subtitleFraze = 'не выходя из дома';
  const getBgImage = () =>
    isMobile ? '/images/desktop/heroImageInsuranceCut.jpg' : '/images/mobile/heroImageInsuranceMobileCut.jpg';
  return (
    <>
      <BreadcrumbsWrapper breadcrumbs={breadcrumbs} />
      <HeroTitle
        title={titleFraze}
        subTitle={subtitleFraze}
        align="center"
        bgImageSrc={getBgImage()}
        addPb={isMobile ? 0.625 : 3.125}
      />
    </>
  );
};

interface InsuranceContainerProps {
  applicationUuid?: string;
}

const InsuranceContainer: FC<InsuranceContainerProps> = ({ applicationUuid }) => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();
  const dispatch = useDispatch();
  const { push, query } = useRouter();
  const [paymentResultModalOpened, setPaymentResultModalOpened] = useState(false);
  const [modalData, setModalData] = useState<ModalData>({
    title: '',
    subtitle: '',
    text: '',
  });
  const router = useRouter();

  const handleLogin = useCallback(
    ({ token, expiresIn }: Token & { expiresIn: number }) => {
      try {
        dispatch(authorize(token, expiresIn));
      } catch (e) {
        // TODO do smtn with authorisation error
        console.error(e);
      }
    },
    [dispatch],
  );

  const [user, filterValues, { initiated, loading, application, services }] = useSelector(
    ({ user: userState, insuranceFilterValues, insuranceApplication }: StateModel) =>
      [userState, insuranceFilterValues, insuranceApplication] as const,
  );

  const insuranceApplications = useMemo(
    () =>
      (application.insurance || []).map((insurance) => ({
        data: insurance,
        paymentLink: services[insurance.type].paymentLink,
        paymentLinkLoading: services[insurance.type].paymentLinkLoading,
      })),
    [application.insurance, services],
  );

  useEffect(() => {
    if (user && initiated) {
      insuranceApplications
        .filter(({ data }) => data.status === APPLICATION_INSURANCE_STATUS.FROZEN)
        .filter(({ data }) => data.type !== query.type)
        .filter(({ paymentLink, paymentLinkLoading }) => paymentLink === '' && !paymentLinkLoading)
        .forEach(({ data }) => dispatch(actions.fetchApplicationPaymentLinks(data.id, data.type)));
    }
  }, [user, initiated, insuranceApplications, dispatch, query.type]);

  useEffect(() => {
    if (user.isAuthorized && applicationUuid) {
      dispatch(actions.fetchInsuranceApplication(applicationUuid));
    }
  }, [dispatch, applicationUuid, user]);

  useEffect(() => {
    if (!query.payment) {
      return;
    }

    if (query.payment === INSURANCE_PAYMENT.SUCCESS) {
      const email = localStorage.getItem('insuranceEmail') || user.email || 'ваш email';
      fireInsuranceSentAnalytics(
        user.uuid,
        query.type as APPLICATION_INSURANCE_TYPE,
        application.insurance.find(({ type }) => type === query.type)?.id,
      );
      setModalData({
        title: 'Спасибо!',
        subtitle: 'Ваш страховой полис оплачен.',
        text: `На ${email} будет отправлено письмо от нашего партнера с детальным описанием по страховому полису.`,
      });
      setPaymentResultModalOpened(true);
    }
  }, [query, user, application.insurance]);

  useEffect(() => {
    return () => {
      dispatch(actions.insuranceApplicationReseted());
    };
  }, [dispatch]);

  const handleCalculate = useCallback(
    (values: InsuranceFormType) => {
      dispatch(actions.saveInsuranceApplication(values));
      localStorage.setItem('insuranceEmail', values.contacts.email || '');
    },
    [dispatch],
  );

  const handleClosePaymentResultModal = useCallback(() => {
    setPaymentResultModalOpened(false);
    router.push('/insurance/calculate');
  }, []);

  const handleResetApplication = useCallback(() => {
    dispatch(actions.insuranceApplicationReseted());
    push('/insurance/calculate', '/insurance/calculate');
  }, [dispatch, push]);

  return (
    <PageBackgroundWrapper
      negativeTop={isMobile ? '2.125' : '3.125'}
      childOne={<InsuranceHeader />}
      colorOne="primary.main"
      childTwo={
        <>
          <ContainerWrapper className={s.root}>
            <Grid container spacing={isMobile ? 2 : 5} direction={isMobile ? 'column' : 'row'}>
              <Grid item xs={12} sm={8}>
                <InsuranceForm
                  filter={filterValues}
                  handleLogin={handleLogin}
                  loading={loading}
                  disabled={!!applicationUuid}
                  handleSubmit={!applicationUuid ? handleCalculate : undefined}
                  handleReset={applicationUuid ? handleResetApplication : undefined}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Grid container direction="column" spacing={isMobile ? 2 : 5} className={s.aside}>
                  <Grid item>
                    <InsuranceBuyBlock />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </ContainerWrapper>
          <BackdropModal
            opened={paymentResultModalOpened}
            handleOpened={setPaymentResultModalOpened}
            onClose={handleClosePaymentResultModal}
          >
            {({ handleClose }) => (
              <SimpleModal title={modalData.title} subtitle={modalData.subtitle} handleClose={handleClose}>
                {modalData.text}
              </SimpleModal>
            )}
          </BackdropModal>
          <Box bgcolor="grey.100">
            <InsuranceFlow />
          </Box>
        </>
      }
      colorTwo="transparent"
    />
  );
};

export default memo(InsuranceContainer);

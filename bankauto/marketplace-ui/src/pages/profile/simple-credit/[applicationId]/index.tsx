import { PagePropsBase } from 'types/PagePropsBase';
import React, { FC, memo, useEffect } from 'react';
import { Meta } from 'components';
import { PersonalAreaLayout } from 'layouts';
import { Box, CircularProgress, ContainerWrapper, Grid, useBreakpoints } from '@marketplace/ui-kit';
import { useSelector } from 'react-redux';
import { StateModel } from 'store/types';
import { useApplication } from 'store/profile/application';
import { useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getPageContextValues } from 'helpers/context/PageContext';
import { StandaloneCredit } from 'containers/Finance';
import { CreditSubtype, SimpleCreditSubtype } from '@marketplace/ui-kit/types';
import { Condition } from 'containers/Finance/Credit/types/Condition';
import { StandaloneCreditInfo } from 'containers/PersonalArea/Application/components';
import { useFinanceCreditStandalone } from 'store/finance/credit/standalone';
import { SimpleCreditStep } from 'containers/Finance/Credit/types/CreditFormTypes';

interface Props extends PagePropsBase {}

const conditions = {
  [SimpleCreditSubtype.JUST_MONEY]: Condition.JUST_MONEY,
  [SimpleCreditSubtype.VEHICLE_NEW]: Condition.AUTHORIZED_DEALER,
  [SimpleCreditSubtype.VEHICLE_USED]: Condition.AUTHORIZED_DEALER,
  [SimpleCreditSubtype.VEHICLE_USED_C2C]: Condition.C2C,
  [CreditSubtype.BDA_C2C]: Condition.C2C,
};

const SimpleCreditRoot: FC = () => {
  const { isAuthorized } = useSelector((state: StateModel) => state.user);

  const {
    fetchApplication,
    container: { loading, initial },
    simpleCredit,
    cancelSimpleCredit,
  } = useApplication();
  const { creditStep } = useFinanceCreditStandalone();
  const { subtype } = simpleCredit;

  const { isMobile } = useBreakpoints();
  const { query } = useRouter();
  const applicationId = query.applicationId as string;

  useEffect(() => {
    if (isAuthorized) fetchApplication(applicationId);
  }, [applicationId, isAuthorized]);

  return (
    <>
      <Meta />
      <PersonalAreaLayout>
        <ContainerWrapper pt={1.625} pb={10}>
          {isAuthorized && loading && (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%" width="100%" py={5}>
              <CircularProgress />
            </Box>
          )}
          {isAuthorized && initial && (
            <>
              {/* <ApplicationHero /> */}
              <Box pt={isMobile ? 1.25 : 7.5}>
                <Grid container direction={isMobile ? 'column-reverse' : 'row'}>
                  <Grid item xs={12}>
                    <Box pt={2.5}>
                      <StandaloneCreditInfo
                        simpleCredit={simpleCredit}
                        creditStep={creditStep ?? SimpleCreditStep.Personal}
                        handleCancelCredit={(callback) => cancelSimpleCredit(callback)}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box pb={7.5}>
                <StandaloneCredit
                  lastCondition={conditions[subtype]}
                  title="Заполнение заявки"
                  closeModalUrl="/profile/applications"
                />
              </Box>
            </>
          )}
        </ContainerWrapper>
      </PersonalAreaLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext<any>) => {
  const pageContext = getPageContextValues({ context, basePath: '/profile/simple-credit/' });

  return { props: { context: pageContext } };
};

const SimpleCredit = memo(SimpleCreditRoot);

export default SimpleCredit;

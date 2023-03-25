import React, { FC, memo } from 'react';
import { useRouter } from 'next/router';
import { ContainerWrapper, Box, useBreakpoints } from '@marketplace/ui-kit';
import { Meta } from 'components';
import { useRouteGuards } from 'hooks';
import { authorizedGuard } from 'guards';
import { PersonalAreaLayout } from 'layouts';
import { AuthRequired } from 'components/AuthRequired';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getPageContextValues } from 'helpers';

const AuthRoot: FC = () => {
  const router = useRouter();
  const { query } = router;
  const authTypeSlug = query.type as string;
  const { isMobile } = useBreakpoints();

  useRouteGuards(authorizedGuard);

  return authTypeSlug ? (
    <>
      <Meta title="Личный кабинет" description="Личный кабинет" />
      <PersonalAreaLayout>
        <ContainerWrapper>
          <Box py={isMobile ? 8 : 32}>
            <AuthRequired />
          </Box>
        </ContainerWrapper>
      </PersonalAreaLayout>
    </>
  ) : null;
};
export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext<any>) => {
  return { props: { context: getPageContextValues({ context }) } };
};
const Auth = memo(AuthRoot);

export default Auth;

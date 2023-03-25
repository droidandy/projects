import React, { FC, memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { Box, CircularProgress, ContainerWrapper } from '@marketplace/ui-kit';
import { Offers, Remont } from '@marketplace/ui-modules';
import { BFF_URL } from 'env-config';
import { getSsrStore } from 'store';
import { ProfileTab } from 'types/Profile';
import { StateModel } from 'store/types';
import { PersonalAreaLayout, ProfileRootPageLayout } from 'layouts';
import { Favorites as FavoritesModule } from '@marketplace/ui-modules';
import { Applications, InsurancesContainer, ProfileContainer, RootContainer } from 'containers/PersonalArea';
import { Meta } from 'components';
import { unauthorizedGuard } from 'guards';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';
import { useFavourites } from '../../store/profile/favourites';
import { VehicleShort } from '@marketplace/ui-kit/types';

const ProfileRoot: FC = () => {
  const user = useSelector((state: StateModel) => state.user);
  const { isAuthorized, isLogout } = user;

  const router = useRouter();
  const activeTab = router.query.slug ? (router.query.slug[0] as ProfileTab) : ProfileTab.ROOT;
  const Layout = ![ProfileTab.ROOT].includes(activeTab) ? PersonalAreaLayout : ProfileRootPageLayout;

  React.useEffect(() => {
    if (!isAuthorized && router.pathname.includes('profile') && !isLogout) {
      unauthorizedGuard();
    }
  }, [isAuthorized, router.pathname, isLogout]);

  const getOfferLink = useCallback(
    (brandAlias: string, modelAlias: string, id: number) => `/offer/${brandAlias}/${modelAlias}/${id}`,
    [],
  );

  const dispatch = useDispatch();
  const { items: favoritesItems, setItems } = useFavourites();
  const handleFavoritesChange = useCallback(
    (favorites: VehicleShort[]) => {
      dispatch(
        setItems({
          items: favorites,
        }),
      );
    },
    [setItems, dispatch],
  );

  return !isAuthorized ? (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
      <CircularProgress />
    </Box>
  ) : (
    <>
      <Meta />
      <Layout>
        <ContainerWrapper pb={18.75} pt={3.75}>
          {activeTab === ProfileTab.ROOT && <RootContainer />}
          {activeTab === ProfileTab.REMONT && <Remont user={user} bffUrl={BFF_URL} token="" />}
          {activeTab === ProfileTab.APPLICATIONS && <Applications />}
          {activeTab === ProfileTab.COMMON_INFO && <ProfileContainer />}
          {activeTab === ProfileTab.OFFERS && <Offers editUrl="/sell/edit" bffUrl={BFF_URL} />}
          {activeTab === ProfileTab.FAVORITES && (
            <FavoritesModule
              token=""
              bffUrl={BFF_URL}
              carListLink="/car"
              getOfferLink={getOfferLink}
              initialItems={favoritesItems}
              onFavoritesChange={handleFavoritesChange}
            />
          )}
          {activeTab === ProfileTab.POLICIES && <InsurancesContainer />}
        </ContainerWrapper>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const store = getSsrStore();
  const { dispatch } = store;
  const issetCurrentCity = await checkAndSetCurrentCity(store, dispatch, context);
  const { city } = store.getState();

  if (!issetCurrentCity) {
    return {
      props: {
        context: getPageContextValues({ context }),
        initialState: { city },
      },
      notFound: true,
    };
  }

  return {
    props: {
      context: getPageContextValues({ context }),
      initialState: { city },
    },
  };
};

const Profile = memo(ProfileRoot);

export default Profile;

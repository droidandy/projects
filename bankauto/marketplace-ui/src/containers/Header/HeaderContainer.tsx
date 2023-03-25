import { ReactComponent as IconDefaultAccount } from '@marketplace/ui-kit/icons/icon-account';
import { ReactComponent as IconAccountWhite } from '@marketplace/ui-kit/icons/iconAccountWhite';
import { FooterContainer } from 'containers/Footer';
import { CityConfirmation } from 'containers/CityConfirmation';
import { MenuLinkItem, useMenuLinks } from 'hooks/useMenuLinks';
import { useRouter } from 'next/router';
import React, { FC, memo, useEffect, useMemo, useState } from 'react';
import useBreakpoints from '@marketplace/ui-kit/hooks/useBreakpoints';
import { useDispatch, useSelector } from 'react-redux';
import { changeAuthModalVisibility, selectUser } from 'store/user';
import { RegistrationTypes } from 'types/Authentication';
import { HeaderProps as HeaderPropsBase } from './types';
import { HeaderMobile } from './components/HeaderMobile/HeaderMobile';
import { HeaderDesktop } from './components/HeaderDesktop/HeaderDesktop';
import { ChooseCityContainer } from '../ChooseCityContainer';
import { getCookieImpersonalization } from 'helpers/authCookies';

export type HeaderProps = Omit<HeaderPropsBase, 'links' | 'advancedLinks'>;

const HeaderRoot: FC<HeaderProps> = (props) => {
  const { isMobile } = useBreakpoints();
  const router = useRouter();

  // mobile header control
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [router.asPath]);

  // links configuration
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthorized = user.isAuthorized && (user.firstName || getCookieImpersonalization());
  const userName = user.lastName ? `${user.lastName} ${user.firstName}.` : user.firstName!;
  const profileLink = useMemo<MenuLinkItem>(() => {
    const profileIcon = props.transparent ? IconAccountWhite : IconDefaultAccount;
    return isAuthorized
      ? {
          parentId: 'Profile',
          href: '/profile',
          text: userName,
          icon: profileIcon,
        }
      : {
          parentId: 'Profile',
          href: '',
          text: 'Кабинет',
          icon: profileIcon,
          onClick: (e: any) => {
            e.preventDefault();
            dispatch(changeAuthModalVisibility(true, { regType: RegistrationTypes.PLAIN }));
          },
        };
  }, [isAuthorized, userName, dispatch, props]);

  const links = useMenuLinks({ Profile: profileLink });

  return (
    <>
      {isMobile ? (
        <HeaderMobile
          links={links}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          footer={<FooterContainer />}
          isAuthorized={isAuthorized}
          {...props}
        />
      ) : (
        <HeaderDesktop links={links} {...props} />
      )}
      <ChooseCityContainer />
      <CityConfirmation />
    </>
  );
};

export const Header = memo(HeaderRoot);

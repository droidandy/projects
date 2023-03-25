import React, { FC, useMemo, useState } from 'react';
import cx from 'classnames';
import { AppBar, Box, Divider, Icon, IconButton, Toolbar, Button, Typography } from '@material-ui/core';
import { ContainerWrapper } from '@marketplace/ui-kit/components';
import { ReactComponent as IconSideMenuColor } from '@marketplace/ui-kit/icons/iconSidemenuColor';
import { ReactComponent as IconCloseBlack } from '@marketplace/ui-kit/icons/iconCloseBlack';
import { ReactComponent as IconAccountWhite } from '@marketplace/ui-kit/icons/iconAccountWhite';
import { ReactComponent as IconDefaultAccount } from '@marketplace/ui-kit/icons/icon-account';
import { Link } from 'components/Link';
import { MenuLinkItem, MenuVariants } from 'hooks/useMenuLinks';
import Logo from 'components/Logo';
import HeaderDrawer from '../HeaderDrawer/HeaderDrawer';
import { HeaderProps } from '../../types';
import { useStyles } from './Header.styles';
import { HeaderCity } from '../../HeaderCity';
import { HeaderFavorites } from '../../HeaderFavorites';
import { HeaderComparison } from '../../HeaderComparison';
import { SectionName } from '../../../../constants/section';

export type HeaderMobileProps = HeaderProps & {
  footer?: React.ReactNode;
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  isAuthorized: string | false | null;
};

const MobileMenuLink: FC<MenuLinkItem> = ({ href, active, text, subLink, id, ...rest }) => {
  const classes = useStyles();
  return (
    <Link
      href={href}
      color={active ? 'primary' : 'inherit'}
      {...rest}
      className={subLink ? classes.subLink : classes.link}
    >
      {text}
    </Link>
  );
};

export const HeaderMobile: FC<HeaderMobileProps> = ({
  transparent,
  position,
  links,
  footer,
  elevation,
  open: openProp,
  onOpen,
  onClose,
  isAuthorized,
  ...rest
}) => {
  const classes = useStyles();
  const [openState, setOpenState] = useState(false);
  const { open, handleOpen, handleClose } = useMemo(
    () =>
      typeof openProp === 'undefined'
        ? {
            open: openState,
            handleOpen: () => {
              setOpenState(true);
            },
            handleClose: () => {
              setOpenState(false);
            },
          }
        : {
            open: openProp,
            handleOpen: () => {
              if (onOpen) {
                onOpen();
              }
            },
            handleClose: () => {
              if (onClose) {
                onClose();
              }
            },
          },
    [openProp, openState, onClose, onOpen],
  );

  const BurgerMenuIcon = useMemo(() => (open ? IconCloseBlack : IconSideMenuColor), [open]);
  const isTransparent = useMemo(() => !open && transparent, [open, transparent]);
  const profileIcon = isTransparent ? IconAccountWhite : IconDefaultAccount;

  const menuLinks = ['About', 'Blog'];
  const advancedLinks = ['VehiclesBuy', 'Instalment', 'Sell', 'Service', 'Insurance'];
  const financeLinks = ['FinanceDeposit', 'FinanceDebitCard', 'FinanceSavingsAccount'];

  return (
    <>
      <AppBar
        className={cx(classes.headerBar, isTransparent && classes.withoutShadow)}
        color={isTransparent ? 'transparent' : 'default'}
        position={position}
        elevation={open ? 4 : elevation}
        {...rest}
      >
        <ContainerWrapper color="transparent">
          <Toolbar disableGutters className={classes.toolbar}>
            <Link href={links.Home.href} className={classes.logo}>
              <Logo color={isTransparent ? 'white' : 'primary'} size="small" />
            </Link>
            {/*<Box ml={1.25} mt={1}>
            </Box>*/}
          </Toolbar>
          <Box className={classes.burger}>
            <IconButton aria-label="menu" onClick={() => (!open ? handleOpen() : handleClose())}>
              <Icon
                viewBox="0 0 24 24"
                component={BurgerMenuIcon}
                className={isTransparent ? classes.transparentBurger : undefined}
              />
            </IconButton>
          </Box>
        </ContainerWrapper>
      </AppBar>
      <HeaderDrawer open={open}>
        {isAuthorized ? (
          <>
            <HeaderFavorites href={links.Favorites.href} transparent={isTransparent} />
            <Divider />
          </>
        ) : null}
        {isAuthorized ? <HeaderComparison href={links.Comparison.href} transparent={isTransparent} /> : null}
        <Divider />
        <Box px={2.5} py={1.25}>
          <Link href={links.Profile.href} color="inherit" onClick={links.Profile.onClick}>
            <Button startIcon={<Icon viewBox="0 0 24 24" component={profileIcon} />}>
              <Typography className={classes.profileButtonText} variant="subtitle1" component="div">
                {links.Profile.text}
              </Typography>
            </Button>
          </Link>
        </Box>
        <Divider />
        <HeaderCity transparent={isTransparent!} />
        <ContainerWrapper my={4.625} ml={0.5}>
          <Box px={1.25}>
            <MobileMenuLink {...links.Vehicles} />
            <Box mt={1} display="flex" flexDirection="column">
              {advancedLinks.map((linkId) => (
                <MobileMenuLink {...links[linkId as MenuVariants]} key={linkId} subLink />
              ))}
            </Box>
          </Box>
        </ContainerWrapper>
        <ContainerWrapper mb={4.625} ml={0.5}>
          <Box px={1.25}>
            <MobileMenuLink {...links.Finance} />
            <Box mt={1} display="flex" flexDirection="column">
              {financeLinks.map((linkId) => (
                <MobileMenuLink {...links[linkId as MenuVariants]} key={linkId} subLink />
              ))}
            </Box>
          </Box>
        </ContainerWrapper>
        <ContainerWrapper mb={4.625} ml={0.5}>
          <Box px={1.25}>
            <MobileMenuLink {...links.Information} />
            <Box mt={1} display="flex" flexDirection="column">
              {menuLinks.map((linkId) => (
                <MobileMenuLink {...links[linkId as MenuVariants]} key={linkId} subLink />
              ))}
            </Box>
          </Box>
        </ContainerWrapper>
        {footer}
      </HeaderDrawer>
    </>
  );
};

import React, { FC } from 'react';
import cx from 'classnames';
import { useSelector } from 'react-redux';
import { AppBar, Toolbar, ContainerWrapper, Grid, Box, Button, Icon } from '@marketplace/ui-kit';
import { selectUser } from 'store/user';
import { Link } from 'components/Link';
import Logo from 'components/Logo';
import { MenuVariants } from 'hooks/useMenuLinks';
import { getCookieImpersonalization } from 'helpers/authCookies';
import { HeaderCity } from '../../HeaderCity';
import { HeaderProps } from '../../types';
import { HeaderFavorites } from '../../HeaderFavorites';
import { HeaderComparison } from '../../HeaderComparison';
import { useStyles } from './Header.styles';

const getLinkColor = (isActive = false, isTransparent = false) => {
  if (isTransparent) {
    return 'inherit';
  }

  return isActive ? 'primary' : 'secondary';
};

export const HeaderDesktop: FC<HeaderProps> = ({ transparent, position, links, ...rest }) => {
  const classes = useStyles();
  const user = useSelector(selectUser);
  const isAuthorized = user.isAuthorized && (user.firstName || getCookieImpersonalization());
  const menuLinksKeys: MenuVariants[] = ['Vehicles', 'Finance', 'About'];
  return (
    <>
      <AppBar className={classes.headerBar} color="default" position={position} {...rest}>
        <Toolbar disableGutters>
          <ContainerWrapper>
            <Box pt={1.25}>
              <Grid container justify="flex-start" alignItems={'center'}>
                <Grid item>
                  <Box>
                    <Link href={links.Home.href}>
                      <Logo color="primary" />
                    </Link>
                  </Box>
                </Grid>
                <Grid item xs>
                  <Box ml={7.5} display="flex">
                    {menuLinksKeys.map((linkId) => (
                      <Box key={`header-link-${linkId}`} pr={3.75}>
                        <Link
                          href={links[linkId].href}
                          variant="body2"
                          className={cx(classes.desktopLink, links[linkId].active ? 'active' : '')}
                          color={getLinkColor(links[linkId].active, transparent)}
                        >
                          {links[linkId].text}
                        </Link>
                      </Box>
                    ))}
                  </Box>
                </Grid>
                <Grid item>
                  <Box fontWeight={600} display="flex" alignItems="center">
                    <HeaderCity transparent={transparent} />
                    {isAuthorized ? <HeaderComparison href={links.Comparison.href} transparent={transparent} /> : null}
                    {isAuthorized ? <HeaderFavorites href={links.Favorites.href} transparent={transparent} /> : null}
                    <Link href={links.Profile.href} color="inherit">
                      <Button
                        className={classes.profileButton}
                        startIcon={
                          <Icon
                            viewBox="0 0 24 24"
                            fontSize="large"
                            htmlColor="transparent"
                            component={links.Profile.icon}
                          />
                        }
                        color="inherit"
                        onClick={links.Profile.onClick}
                      >
                        <span className={classes.profileButtonText}>{links.Profile.text}</span>
                      </Button>
                    </Link>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </ContainerWrapper>
        </Toolbar>
      </AppBar>
    </>
  );
};

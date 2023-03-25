import React, { FC, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Icon, Typography, Box, Button, ContainerWrapper } from '@marketplace/ui-kit';
import { CatalogLayout } from 'layouts';
import { useCity } from 'store/city';
import { ErrorIcon } from './icons';
import { VALID_DOMAINS } from 'constants/validDomains';
import { useStyles } from './Container404.styles';

export const Container404: FC = () => {
  const { iconWrapper, icon, iconComponent } = useStyles();
  const { replace, push } = useRouter();
  const { current } = useCity();

  const handleClick = useCallback(() => {
    if (typeof window !== 'undefined') {
      const {
        location: { host, protocol, pathname, search },
      } = window;

      const urlCityAlias = host.split('.')[0];
      const issetCurrentCity =
        VALID_DOMAINS.some((item) => urlCityAlias.includes(item)) || current.alias === urlCityAlias;

      if (!issetCurrentCity) {
        const domain = host.split('.').slice(1).join('.');
        const newUrl = `${protocol}//${domain}${pathname}${search}`;
        return replace(newUrl);
      }
    }
    push('/');
  }, [current]);

  return (
    <CatalogLayout>
      <ContainerWrapper>
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" pt={9} pb={15}>
          <Box className={iconWrapper}>
            <Box className={icon}>
              <Icon component={ErrorIcon} viewBox="0 0 24 32" className={iconComponent} />
            </Box>
          </Box>
          <Box pt={2.75} textAlign="center">
            <Typography component="h1" variant="h3">
              Ошибка 404
            </Typography>
            <Typography component="p" variant="subtitle1">
              Страница не найдена
            </Typography>
          </Box>
          <Box pt={7} maxWidth={365} width="100%">
            <Button variant="contained" color="primary" size="large" onClick={handleClick} fullWidth>
              <Typography variant="h4" component="span">
                Перейти на главную
              </Typography>
            </Button>
          </Box>
        </Box>
      </ContainerWrapper>
    </CatalogLayout>
  );
};

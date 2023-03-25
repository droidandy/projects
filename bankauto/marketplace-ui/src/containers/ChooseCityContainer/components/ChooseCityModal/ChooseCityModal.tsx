import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { BackdropModal, Box, Divider, Icon, IconButton, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { Props as BackdropModalProps } from '@marketplace/ui-kit/components/BackdropModal';
import { ReactComponent as IconClose } from '@marketplace/ui-kit/icons/icon-close.svg';
import { List, ListItem, ListItemText, TextField } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import { VALID_DOMAINS } from 'constants/validDomains';
import { setCityCookie } from 'helpers/cookies/city';
import { ReactComponent as IconSearch } from 'icons/iconSearch.svg';
import { useCity } from 'store/city';
import { City } from 'types/City';
import { RadiusSelect } from './RadiusSelect';
import { useStyles } from './ChooseCityModal.styles';

type ChooseCityModalProps = {} & Required<Pick<BackdropModalProps, 'opened' | 'handleOpened'>>;

export const getCityFullUrl = (value: City) => {
  let nextDomain = '';
  const nextDomainCity = value.alias === 'russia' || value.alias === 'moskva' ? '' : value.alias;

  const {
    location: { host, protocol, pathname, search },
  } = window;

  switch (true) {
    case VALID_DOMAINS.some((domain) => host.includes(domain)):
      const lowestSubDomain = host.split('.')[0];
      nextDomain = VALID_DOMAINS.some((domain) => lowestSubDomain.includes(domain))
        ? host
        : host.split('.').slice(1).join('.');
      break;

    case host.includes('localhost'):
    case host.includes('marketplace'):
      nextDomain = host;
      break;

    case host.includes('bankauto'):
      nextDomain = 'bankauto.ru';
      break;

    default:
      nextDomain = host.split('.').slice(0).join('.');
      break;
  }

  return `${protocol}//${nextDomainCity ? `${nextDomainCity}.` : ''}${nextDomain}${pathname}${search}`;
};

const allRussiaId = 2;

export const ChooseCityModal = ({ opened, handleOpened }: ChooseCityModalProps) => {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCities, setSelectedCities] = useState<City[]>(cities);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const { current, list, fetchCitiesList } = useCity();
  const { isMobile } = useBreakpoints();
  const s = useStyles();
  const router = useRouter();
  const showRadiusSelect =
    current.id !== allRussiaId &&
    (router.asPath === '/' || router.asPath.includes('car') || router.asPath.includes('offer'));

  useEffect(() => {
    if ([...list.primary, ...list.secondary].length < 2) {
      fetchCitiesList();
    }
  }, []);

  useEffect(() => {
    if (opened && list.primary && !inputValue) {
      setCities([...list.primary, ...list.secondary]);
    }
  }, [opened, list, inputValue]);

  useEffect(() => {
    setSelectedCities(cities);
  }, [cities]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const values = cities.filter(
        (value) => !(e.target.value && !value.name.toLowerCase().includes(e.target.value.toLowerCase().trim())),
      );

      if (values.length === 0) {
        setIsEmpty(true);
        setSelectedCities(cities);
        setInputValue(e.target.value);
      } else {
        setIsEmpty(false);
        setSelectedCities(values);
        setInputValue(e.target.value);
      }
    },
    [cities],
  );

  const handleClear = () => {
    setInputValue('');
    setIsEmpty(false);
  };

  const startAdornment = useMemo(() => {
    return (
      <InputAdornment position="start">
        <Icon viewBox="0 0 24 24" component={IconSearch} style={{ fill: 'none' }} />
      </InputAdornment>
    );
  }, []);

  const endAdornment = useMemo(() => {
    return (
      <InputAdornment position="end">
        <IconButton onClick={handleClear} className={s.iconButton}>
          <Icon
            viewBox="0 0 20 20"
            component={IconClose}
            className={s.closeIcon}
            style={{ height: '0.875rem', width: '0.875rem' }}
          />
        </IconButton>
      </InputAdornment>
    );
  }, []);

  const listItemClickHandler = (href: string, city: City) => {
    setCityCookie(city);
    window.setTimeout(() => {
      window.location.assign(href);
    }, 200);
  };

  return (
    <BackdropModal opened={opened} handleOpened={handleOpened}>
      {({ handleClose }) => (
        <Box
          p={isMobile ? 3 : 7.5}
          pt={isMobile ? 2.75 : 5}
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          bgcolor="common.white"
          className={s.modal}
        >
          <Box margin={2.5} position="absolute" top="0" right="0" zIndex="1">
            <IconButton aria-label="close" onClick={handleClose} style={isMobile ? { padding: '0' } : {}}>
              <Icon viewBox="0 0 16 16" className={s.closeIcon} component={IconClose} />
            </IconButton>
          </Box>
          <Typography variant={isMobile ? 'h5' : 'h3'} component="div" className={s.title}>
            Выберите город
          </Typography>

          <Box
            mt={isMobile ? 3 : 0}
            pt={isMobile ? 2.25 : 2.5}
            pb={isMobile ? 2.25 : 1.25}
            textAlign="start"
            mx={isMobile ? -3 : 0}
            pl={isMobile ? 3 : 0}
            bgcolor={isMobile ? 'grey.300' : ''}
          >
            <Typography component="span" variant="body1">
              Выбранный город: <b>{current.name}</b>
            </Typography>
          </Box>

          {showRadiusSelect && <RadiusSelect />}

          <Box>
            <TextField
              name="city"
              placeholder={inputValue ? '' : 'Ваш город'}
              onChange={(e) => handleChange(e as any)}
              variant="standard"
              InputProps={
                isMobile
                  ? {
                      startAdornment,
                      endAdornment,
                      inputProps: {
                        autocomplete: 'off',
                      },
                    }
                  : {
                      endAdornment,
                      inputProps: {
                        autocomplete: 'off',
                      },
                    }
              }
              value={inputValue}
              className={s.filterInput}
            />
            {isEmpty && (
              <Box pt={1.25} textAlign="start">
                <Typography variant={isMobile ? 'caption' : 'body2'} component="div" className={s.message}>
                  Город не найден. Выберите город из списка ниже.
                </Typography>
              </Box>
            )}
          </Box>
          <List className={s.list}>
            {selectedCities.map((city) => (
              <a
                href={getCityFullUrl(city)}
                onClick={(e) => {
                  e.preventDefault();
                  listItemClickHandler(e.currentTarget.href, city);
                }}
                key={city.id}
              >
                <ListItem button className={s.listItem}>
                  <ListItemText className={s.listItemText}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>{city.name}</Typography>
                      {city.vehiclesCount && (
                        <Box style={{ width: '4.5rem' }}>
                          <Typography color="secondary">{city.vehiclesCount}</Typography>
                        </Box>
                      )}
                    </Box>
                  </ListItemText>
                </ListItem>
                {isMobile && <Divider />}
              </a>
            ))}
          </List>
        </Box>
      )}
    </BackdropModal>
  );
};

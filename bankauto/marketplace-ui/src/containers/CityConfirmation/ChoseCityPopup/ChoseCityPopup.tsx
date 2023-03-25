import React, { FC } from 'react';
import { Box, Button, Icon, Paper, Typography, ClickAwayListener } from '@material-ui/core';
import { BackdropModal, useBreakpoints } from '@marketplace/ui-kit';
import { ReactComponent as LocationDark } from 'icons/iconLocation.svg';
import { useStyles } from './ChoseCityPopup.styles';

interface Props {
  opened: boolean;
  toggleVisibility(val: boolean): void;
  cityName: string;
  confirmCity(): void;
  changeCity(): void;
}

export const ChoseCityPopup: FC<Props> = ({ opened, toggleVisibility, cityName, confirmCity, changeCity }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  return (
    <ClickAwayListener onClickAway={confirmCity}>
      <div>
        {isMobile ? (
          <BackdropModal opened={opened} handleOpened={toggleVisibility} onClose={confirmCity}>
            {() => (
              <Paper className={s.mobileRoot}>
                <Box display="flex" justifyContent="flex-start">
                  <Icon
                    viewBox="0 0 24 24"
                    fontSize="default"
                    component={LocationDark}
                    style={{ fill: 'none', marginRight: '0.85rem' }}
                  />

                  <Box>
                    <Typography variant="body1">Ваш город:</Typography>
                    <Typography variant="h5">{cityName}?</Typography>
                  </Box>
                </Box>
                <Box pt={2.5} fontWeight={700}>
                  <Button fullWidth variant="contained" size="large" color="primary" onClick={confirmCity}>
                    Все верно
                  </Button>
                </Box>
                <Box pt={2.5} fontWeight={700}>
                  <Button fullWidth variant="outlined" size="large" color="primary" onClick={changeCity}>
                    Выбрать город
                  </Button>
                </Box>
              </Paper>
            )}
          </BackdropModal>
        ) : (
          (opened && (
            <Paper className={s.desktopRoot}>
              <Box display="flex" justifyContent="flex-start" alignItems="center">
                <Icon
                  viewBox="0 0 24 24"
                  fontSize="default"
                  component={LocationDark}
                  style={{ fill: 'none', marginRight: '0.85rem' }}
                />
                <Typography variant="body1">Ваш город:&nbsp;</Typography>
                <Typography variant="h5">{cityName}?</Typography>
              </Box>
              <Box pt={2.5} fontWeight={700} display="flex" justifyContent="space-between">
                <Button
                  className={s.desktopButton}
                  variant="contained"
                  size="medium"
                  color="primary"
                  onClick={confirmCity}
                >
                  Все верно
                </Button>
                <Button
                  className={s.desktopButton}
                  variant="outlined"
                  size="medium"
                  color="primary"
                  onClick={changeCity}
                >
                  Выбрать город
                </Button>
              </Box>
            </Paper>
          )) ||
          null
        )}
      </div>
    </ClickAwayListener>
  );
};

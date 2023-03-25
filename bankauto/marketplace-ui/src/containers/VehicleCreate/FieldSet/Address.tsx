import React, { useState } from 'react';
import { Field } from 'react-final-form';
import { Button, Typography, BackdropModal, Box, IconButton, Icon, Grid, useBreakpoints } from '@marketplace/ui-kit';
import { ReactComponent as IconClose } from '@marketplace/ui-kit/icons/icon-close.svg';
import { ReactComponent as NavigatorArrayIcon } from 'icons/iconNavigatorArrow.svg';
import { MapAddressSelect } from './fields/AddressSelect/MapAddressSelect';
import { AddressAutocomplete } from './fields/AddressSelect/AddressAutocomplete';
import { AddressContainer } from '../../../types/VehicleFormType';

export const VehicleAddressFieldSet = () => {
  const { isMobile } = useBreakpoints();
  const [mapOpened, setMapOpened] = useState<boolean>(false);

  const handleOpenMap = () => {
    setMapOpened(true);
  };

  return (
    <Field name="address">
      {({ input }) => (
        <>
          <Grid container spacing={isMobile ? 1 : 4}>
            <Grid item sm={8} xs={12}>
              <AddressAutocomplete address={input.value} onAddressSelect={input.onChange} />
            </Grid>
            <Grid item sm={4} xs={12}>
              <Button variant="text" size="large" color="primary" onClick={handleOpenMap}>
                <NavigatorArrayIcon style={{ marginRight: '0.5rem' }} />
                <Typography variant="subtitle1">Указать расположение на карте</Typography>
              </Button>
            </Grid>
          </Grid>
          <BackdropModal opened={mapOpened} handleOpened={setMapOpened}>
            {({ handleClose }) => (
              <Box bgcolor="common.white" borderRadius="1rem" overflow="hidden">
                <Box position="relative">
                  <Box p={5}>
                    <Typography variant="h3" align="center">
                      Место осмотра автомобиля
                    </Typography>
                  </Box>
                  <Box margin={2.5} position="absolute" top="0" right="0" zIndex="1">
                    <IconButton aria-label="close" onClick={handleClose}>
                      <Icon viewBox="0 0 16 16" width="14" height="14" component={IconClose} />
                    </IconButton>
                  </Box>
                </Box>
                <MapAddressSelect
                  address={input.value}
                  onAddressSelect={(address: AddressContainer) => {
                    input.onChange(address);
                    setMapOpened(false);
                  }}
                />
              </Box>
            )}
          </BackdropModal>
        </>
      )}
    </Field>
  );
};

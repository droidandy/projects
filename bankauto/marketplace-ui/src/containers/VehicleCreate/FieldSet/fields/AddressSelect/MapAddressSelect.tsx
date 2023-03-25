import React, { useState } from 'react';
import { Box, Button, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { MapContainer } from '../Map/MapContainer';
import { AddressAutocomplete } from './AddressAutocomplete';
import { AddressContainer } from '../../../../../types/VehicleFormType';

type MapAddressSelectProps = {
  address?: AddressContainer | null;
  onAddressSelect: (address: AddressContainer) => void;
};

export const MapAddressSelect = ({ address: defaultAddress = null, onAddressSelect }: MapAddressSelectProps) => {
  const { isMobile } = useBreakpoints();
  const [address, setAddress] = useState<AddressContainer | null>(defaultAddress);

  const handleAddressChange = (address: AddressContainer) => {
    setAddress(address);
  };

  const handleConfirmAddress = () => {
    onAddressSelect(address!);
  };

  return (
    <Box position="relative" height={isMobile ? 'calc(100vh - 9.5rem)' : 536} width={isMobile ? '100vw' : 770}>
      <Box
        position="absolute"
        top="1.25rem"
        left={isMobile ? '1rem' : '6.25rem'}
        right={isMobile ? '1rem' : '6.25rem'}
        zIndex={999}
      >
        <AddressAutocomplete address={address} onAddressSelect={handleAddressChange} />
      </Box>
      <MapContainer onAddressSelect={handleAddressChange} address={address} />
      <Box position="absolute" bottom="1.25rem" zIndex={999} display="flex" justifyContent="center" width="100%">
        <Box
          bgcolor="common.white"
          borderRadius="1rem"
          ml={isMobile ? '1rem' : 'auto'}
          mr={isMobile ? '1rem' : 'auto'}
          width={isMobile ? '100%' : 'auto'}
        >
          <Button
            fullWidth
            variant="contained"
            size="large"
            color="primary"
            disabled={!address}
            onClick={handleConfirmAddress}
          >
            <Typography variant="subtitle1">Подтвердить</Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

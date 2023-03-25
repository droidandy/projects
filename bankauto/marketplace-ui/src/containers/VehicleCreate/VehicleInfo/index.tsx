import React, { useMemo } from 'react';
import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { VehicleFormSellValues } from 'types/VehicleFormType';
import { useFormState } from 'react-final-form';
import { useVehicleCreateDataProperties } from 'store/catalog/create/data';
import { getDataItem, getDataOption } from '../utils';

export const VehicleInfo = () => {
  const { isMobile } = useBreakpoints();

  const { brand, model, generation, transmission, engine, drive, modification, color } =
    useVehicleCreateDataProperties();
  const { values } = useFormState<VehicleFormSellValues>();

  const vehicleName = useMemo<string>(() => {
    const brandItem = getDataOption(brand, values.brand);
    const modelItem = getDataOption(model, values.model);
    const generationItem = getDataItem(generation, values.generation);
    const vehicleDataArray = [brandItem?.label, modelItem?.label, generationItem?.name].filter((i) => !!i);

    return vehicleDataArray.join(' ');
  }, [brand, model, generation, values]);

  const vehicleInfo = useMemo<string | null>(() => {
    const engineItem = getDataItem(engine, values.engine);
    const transmissionItem = getDataItem(transmission, values.transmission);
    const driveItem = getDataItem(drive, values.drive);
    const modificationItem = getDataItem(modification, values.modification);
    const colorItem = getDataItem(color, values.color);

    const vehicleDataArray = [
      values.vin && `VIN: ${values.vin}`,
      values.year && `${values.year} год`,
      transmissionItem?.name,
      driveItem?.name,
      engineItem?.name,
      modificationItem && `${modificationItem.volume} л.`,
      modificationItem && `${modificationItem.power} л.с.`,
      colorItem?.name,
    ].filter((i) => !!i);

    return vehicleDataArray.length ? vehicleDataArray.join(' • ') : null;
  }, [transmission, drive, engine, modification, color, values]);

  return (
    <div>
      <Typography variant={isMobile ? 'h4' : 'h3'}>{vehicleName}</Typography>
      <Box pt={1.25}>
        <Typography variant={isMobile ? 'body2' : 'body1'}>{vehicleInfo}</Typography>
      </Box>
    </div>
  );
};

import React, { FC, useEffect, useMemo } from 'react';
import { useVehicleItem } from 'store/catalog/vehicle/item';
import { ColorPicker, useBreakpoints } from '@marketplace/ui-kit';
import { Color } from '@marketplace/ui-kit/types';
import { useStyles } from './VehicleChooseColor.styles';

export const VehicleChooseColor: FC = () => {
  const { mobileClass, desktopClass } = useStyles();
  const { isMobile } = useBreakpoints();
  const {
    vehicle,
    availableColors,
    pickedColor,
    fetchVehicleColors,
    flushVehicleColors,
    setVehicleColorValue,
    flushVehicleColorValue,
  } = useVehicleItem();

  // fetch car colors on mount
  useEffect(() => {
    if (vehicle && availableColors === null) {
      fetchVehicleColors();
    }
  }, [vehicle, availableColors, fetchVehicleColors]);

  // clear store data on unmount
  useEffect(() => {
    return () => {
      flushVehicleColors();
      flushVehicleColorValue();
    };
  }, []);

  const selected = useMemo<number[] | undefined>(() => (pickedColor ? [pickedColor.id] : undefined), [pickedColor]);
  return (
    <>
      {availableColors ? (
        <ColorPicker
          className={isMobile ? mobileClass : desktopClass}
          key="colors"
          colors={availableColors as never as Color[]}
          selectedInitial={selected}
          onChange={(selectedColors: number[]) => {
            const picked = availableColors.find((c) => c.id === selectedColors[0]);
            if (picked) {
              setVehicleColorValue(picked);
            }
          }}
          radio
        />
      ) : null}
    </>
  );
};

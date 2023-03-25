import React, { FC, memo, useMemo } from 'react';
import { Box, useBreakpoints } from '@marketplace/ui-kit';
import { useVehicleItem } from 'store/catalog/vehicle/item';
import { Gallery, GalleryDesktop, GalleryImageContainer } from 'containers/Vehicle/components/Gallery';
import { IMAGE_GALLERY_DESKTOP_DEFAULT, IMAGE_VEHICLE_CARD_DEFAULT } from 'constants/imagesDefault';
import { isBankautoDealerId } from 'helpers/isBankautoDealer';

export const GalleryContainer: FC = memo(() => {
  const { isMobile } = useBreakpoints();
  const { vehicle, pickedColor } = useVehicleItem();

  const mobileImages = useMemo<string[]>(
    () =>
      vehicle && vehicle.photos.length ? vehicle.photos.map((photo) => photo['750']) : [IMAGE_GALLERY_DESKTOP_DEFAULT],
    [vehicle],
  );

  const desktopImages = useMemo<GalleryImageContainer[]>(
    () =>
      vehicle && vehicle.photos.length
        ? vehicle.photos.map((sizes) => ({
            thumbnail: sizes['100'],
            medium: sizes['750'],
            large: sizes['750'],
            id: sizes['100'],
          }))
        : [
            {
              thumbnail: IMAGE_VEHICLE_CARD_DEFAULT,
              medium: IMAGE_GALLERY_DESKTOP_DEFAULT,
              large: IMAGE_GALLERY_DESKTOP_DEFAULT,
              id: 'emptyImage',
            },
          ],
    [vehicle],
  );

  const isBankautoDealer = isBankautoDealerId(vehicle?.salesOfficeId || 0);
  const isSoldOut = vehicle?.cancelReason !== null;
  return vehicle ? (
    <Box position="relative" overflow="hidden">
      {isMobile ? (
        <Gallery
          key={vehicle.id}
          images={mobileImages}
          videoUrl={vehicle.videoUrl}
          isBankautoDealer={isBankautoDealer}
          isSoldOut={isSoldOut}
        />
      ) : (
        <GalleryDesktop
          key={`${vehicle.id}-${pickedColor?.id || ''}`}
          images={desktopImages}
          videoUrl={vehicle.videoUrl}
          isBankautoDealer={isBankautoDealer}
        />
      )}
    </Box>
  ) : null;
});

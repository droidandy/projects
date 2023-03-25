import React, { memo, useMemo, FC } from 'react';
import { Box, useBreakpoints } from '@marketplace/ui-kit';
import { Gallery, GalleryDesktop, GalleryImageContainer } from 'containers/Vehicle/components/Gallery';
import { useVehicleItem } from 'store/catalog/vehicle/item';
import { IMAGE_GALLERY_DESKTOP_DEFAULT, IMAGE_VEHICLE_CARD_DEFAULT } from 'constants/imagesDefault';

export const GalleryContainer: FC = memo(() => {
  const { isMobile } = useBreakpoints();
  const { vehicle } = useVehicleItem();
  const mobileImages = useMemo<string[]>(
    () =>
      vehicle && vehicle.photos.length ? vehicle.photos.map((photo) => photo['750']) : [IMAGE_VEHICLE_CARD_DEFAULT],
    [vehicle],
  );
  const desktopImages = useMemo<GalleryImageContainer[]>(
    () =>
      vehicle && vehicle.photos.length
        ? vehicle.photos.map((sizes) => ({
            thumbnail: sizes['100']!,
            medium: sizes['750']!,
            large: sizes['750']!,
            id: sizes['100']!,
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

  return vehicle ? (
    <Box position="relative" overflow="hidden">
      {isMobile ? (
        <Gallery
          key={vehicle.id}
          images={mobileImages}
          videoUrl={vehicle.videoUrl && `https://www.youtube.com/watch?v=${vehicle.videoUrl}`}
        />
      ) : (
        <GalleryDesktop
          key={vehicle.id}
          images={desktopImages}
          videoUrl={vehicle.videoUrl && `https://www.youtube.com/watch?v=${vehicle.videoUrl}`}
        />
      )}
    </Box>
  ) : null;
});

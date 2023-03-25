import React, { memo, useMemo, FC } from 'react';
import { Box, useBreakpoints } from '@marketplace/ui-kit';
import { Gallery, GalleryDesktop, GalleryImageContainer } from 'containers/Vehicle/components/Gallery';
import { useInstalmentOffer } from 'store/instalment/vehicle/item';

export const GalleryContainer: FC = memo(() => {
  const { isMobile } = useBreakpoints();
  const { vehicle } = useInstalmentOffer();
  const chipText = vehicle?.specialOffer ? vehicle.text.toUpperCase() : '';
  const mobileImages = useMemo<string[]>(() => (vehicle ? vehicle.photos.map((sizes) => sizes['750']) : []), [vehicle]);
  const desktopImages = useMemo<GalleryImageContainer[]>(
    () =>
      vehicle
        ? vehicle.photos.map((sizes) => ({
            thumbnail: sizes['100'],
            medium: sizes['750'],
            large: sizes.max,
            id: sizes['100'],
          }))
        : [],
    [vehicle],
  );

  return vehicle ? (
    <Box position="relative" overflow="hidden">
      {isMobile ? (
        <Gallery key={vehicle.id} images={mobileImages} videoUrl={vehicle.videoUrl} chipText={chipText} />
      ) : (
        <GalleryDesktop key={vehicle.id} images={desktopImages} videoUrl={vehicle.videoUrl} />
      )}
    </Box>
  ) : null;
});

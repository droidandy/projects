import IMAGES from '../../resources';

export type MarkerType = 'user' | 'pharmacy';
export type MarkerPharmacyType = 'cheapest' | 'full' | 'nearest' | 'selected' | 'partial';

const PharmacyMarkers = IMAGES.markers;

// eslint-disable-next-line @typescript-eslint/no-var-requires

export const getPharmacyMarker = (
  pharmacyType: MarkerPharmacyType = 'full',
  favourite = true,
): any => {
  switch (pharmacyType) {
    case 'cheapest':
      return favourite ? PharmacyMarkers.cheapestFavourite : PharmacyMarkers.cheapest;
    case 'partial':
      return favourite ? PharmacyMarkers.partialFavourite : PharmacyMarkers.partial;
    case 'nearest':
      return favourite ? PharmacyMarkers.nearestFavourite : PharmacyMarkers.nearest;
    case 'selected':
      return PharmacyMarkers.selected;
    case 'full':
    default:
      return favourite ? PharmacyMarkers.fullFavourite : PharmacyMarkers.full;
  }
};

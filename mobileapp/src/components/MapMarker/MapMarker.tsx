import React, { useContext } from 'react';
import { Image } from 'react-native';
import { LatLng, Marker, MarkerProps } from 'react-native-maps';
import { getPharmacyMarker, MarkerType, MarkerPharmacyType } from './MapMarker.utils';
import IMAGES from '../../resources';
import { MapContext } from '../../contexts/map';

interface Props extends MarkerProps {
  listIndex?: number;
  type?: MarkerType;
  pharmacyType?: MarkerPharmacyType;
  favourite?: boolean;
}

const MapMarkerBase = (props: Props) => {
  const { flyTo } = useContext(MapContext);
  const {
    type = 'pharmacy',
    pharmacyType = 'full',
    favourite = false,
    coordinate,
    listIndex,
  } = props;
  const image =
    type === 'pharmacy' ? getPharmacyMarker(pharmacyType, favourite) : IMAGES.markers.user;
  const { width, height } = Image.resolveAssetSource(image);
  const handlePress = () => {
    if (coordinate) {
      flyTo(coordinate as LatLng, listIndex);
    }
  };

  return (
    <Marker
      {...props}
      coordinate={coordinate}
      image={image}
      onPress={handlePress}
      centerOffset={{ x: -width / 2, y: -height }}
      anchor={{ x: 0.5, y: 1 }}
      zIndex={type === 'pharmacy' ? 1 : 0}
    />
  );
};

export const MapMarker = React.memo<Props>(MapMarkerBase);

import React, { useCallback, useMemo, useRef } from 'react';
import { FlatList, View } from 'react-native';
import MapView, { LatLng, PROVIDER_GOOGLE } from 'react-native-maps';
import { keyExtractor } from '../../helpers/models';
import { GeoCoordsModel, Maybe } from '../../apollo/requests';
import { FlatDataContainer } from '../layouts/FlatDataContainer/FlatDataContainer';
import { NoData } from '../../components/DataChecker/DataChecker';
import { MapMarker } from '../../components/MapMarker/MapMarker';
import { SeparatorDash } from '../../components/SeparatorDash/SeparatorDash';
import { mapStyles, styles } from './Favourites.styles';
import { MapContext } from '../../contexts/map';
import { INITIAL_REGION } from '../../helpers/const';
import { PharmacyItem } from '../../components/pharmacies/PharmacyItem';
import { usePharmacies } from '../../contexts/common-data-provider';

// TODO: пофиксить производительность
const PharmaciesBase = () => {
  const { favorites } = usePharmacies();
  const listRef = useRef<FlatList>(null);
  const lastMapLocation = useRef<{ latitude: number; longitude: number } | undefined>(undefined);
  const mapView = useRef<MapView | null>(null);
  const flyTo = useCallback((center?: LatLng | null, listIndex?: number, zoom = 17) => {
    if (!!center) {
      mapView.current?.animateCamera({ center, zoom: zoom }, { duration: 250 });
      if (listIndex && listRef.current) {
        // mapView.current?.setCamera({ center, zoom });
        listRef.current.scrollToIndex({ index: listIndex });
      }
    }
  }, []);

  const markers = useMemo(() => {
    return favorites.length
      ? favorites.map(pharmacy =>
          pharmacy.coordinate ? (
            <MapMarker
              key={pharmacy.id}
              type="pharmacy"
              coordinate={pharmacy.coordinate}
              favourite={pharmacy.isFavourite}
            />
          ) : null,
        )
      : [];
  }, [favorites]);

  const startPoint = useMemo(() => {
    return favorites.length ? { ...INITIAL_REGION, ...favorites[0].coordinate } : INITIAL_REGION;
  }, [favorites]);

  if (favorites.length === 0) {
    return <NoData label="Вы ещё не добавили ни одной аптеки в список избранных" />;
  }

  return (
    <MapContext.Provider value={{ flyTo }}>
      <View key="container" style={styles.container}>
        <MapView
          initialRegion={startPoint}
          key="maps"
          ref={mapView}
          showsUserLocation={false}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          customMapStyle={mapStyles}
        >
          {markers}
        </MapView>
        <FlatDataContainer
          ref={listRef}
          key="pharmacies"
          data={favorites}
          renderItem={info => <PharmacyItem pharmacy={info.item} />}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={SeparatorDash}
          style={styles.list}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </MapContext.Provider>
  );
};

export const Pharmacies = React.memo<{}>(PharmaciesBase);

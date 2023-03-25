import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import MapView, { LatLng, PROVIDER_GOOGLE } from 'react-native-maps';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { keyExtractor } from '../../helpers/models';
import { ListPharmacyFragment } from '../../apollo/requests';
import { FlatDataContainer } from '../../containers/layouts/FlatDataContainer/FlatDataContainer';
import { ErrorLoading, NoData } from '../DataChecker/DataChecker';
import { MapMarker } from '../MapMarker/MapMarker';
import { SeparatorDash } from '../SeparatorDash/SeparatorDash';
import { mapStyles, styles } from './Pharmacies.styles';
import { MapContext } from '../../contexts/map';
import { INITIAL_REGION } from '../../helpers/const';
import { PharmacyItem } from './PharmacyItem';
import { usePharmacies } from '../../contexts/common-data-provider';

export interface Props<ItemT = any> {
  renderItem: ListRenderItem<ItemT>;
  children?: React.ReactNode;
  activePharmacy?: ListPharmacyFragment;
  footerTopAdornment?: React.ReactNode;

  onMarkerPress?(data?: ListPharmacyFragment): void;
}

const defaultRenderItem = info => <PharmacyItem pharmacy={info.item} />;

const filterNoDataLabels = [
  'Аптек нет',
  'Вы ещё не добавили ни одной аптеки в список избранных',
  'Сегодня ни одна аптека не работает круглосуточно',
];
const segmentedControlItems = ['Все', 'Избранные', 'Круглосуточные'];

export const Pharmacies = ({
  renderItem = defaultRenderItem,
  activePharmacy,
  children,
  onMarkerPress,
  footerTopAdornment,
}: Props) => {
  const pharmacies = usePharmacies();
  const [pharmacyType, setPharmacyType] = useState<number>(0);
  const mapView = useRef<MapView | null>(null);
  const listRef = useRef<FlatList>(null);
  // const coords: LatLng | undefined = undefined; // TODO user coordinates;

  const flyTo = useCallback((center?: LatLng | null, listIndex?: number, zoom = 17) => {
    if (!!center) {
      mapView.current?.animateCamera({ center, zoom: zoom }, { duration: 250 });
      if (listIndex && listRef.current) {
        // mapView.current?.setCamera({ center, zoom });
        listRef.current.scrollToIndex({ index: listIndex });
      }
    }
  }, []);

  const startPoint = useMemo(() => {
    return pharmacies.cityPharmacies.length
      ? { ...INITIAL_REGION, ...pharmacies.cityPharmacies[0].coordinate }
      : INITIAL_REGION;
  }, [pharmacies.cityPharmacies]);

  const filteredPharmacies = useMemo(() => {
    switch (pharmacyType) {
      case 1:
        return pharmacies.favorites;
      case 2:
        return pharmacies.aroundTheClock;
      case 0:
      default:
        return pharmacies.cityPharmacies;
    }
  }, [pharmacyType, pharmacies.aroundTheClock, pharmacies.cityPharmacies, pharmacies.favorites]);

  const hasActivePharmacy = !!activePharmacy;
  const activePharmacyXmlId = activePharmacy?.xmlId;

  const markers = useMemo(
    () =>
      filteredPharmacies.length
        ? filteredPharmacies.map((pharmacy, i) =>
            pharmacy.coordinate ? (
              <MapMarker
                listIndex={i}
                key={pharmacy.id}
                pharmacyType={
                  hasActivePharmacy && activePharmacyXmlId === pharmacy.xmlId ? 'selected' : 'full'
                }
                onPress={() => onMarkerPress && onMarkerPress(pharmacy)}
                coordinate={pharmacy.coordinate}
                favourite={pharmacy.isFavourite}
              />
            ) : null,
          )
        : [],
    [activePharmacyXmlId, filteredPharmacies, hasActivePharmacy, onMarkerPress],
  );

  if (pharmacies.all.length === 0) {
    return (
      <ErrorLoading
        text="Аптек нет"
        refetchLabel="Обновить список аптек"
        refetch={pharmacies.refetch}
      />
    );
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
          style={styles.map}
          customMapStyle={mapStyles}
        >
          {/*{!!coords ? <MapMarker key="my-location" type="user" coordinate={coords} /> : null}*/}
          {markers}
        </MapView>
        <View key="segmented-control" style={styles.filter}>
          <SegmentedControlTab
            values={segmentedControlItems}
            selectedIndex={pharmacyType}
            onTabPress={(index): void => setPharmacyType(index)}
            activeTabStyle={styles.activeTab}
            tabStyle={styles.tabsContainer}
            tabTextStyle={styles.tabText}
          />
        </View>
        {filteredPharmacies.length === 0 ? (
          <View key="data-checker" style={styles.list}>
            <NoData label={filterNoDataLabels[pharmacyType]} />
          </View>
        ) : (
          <FlatDataContainer
            key="pharmacies"
            initialNumToRender={filteredPharmacies.length}
            data={filteredPharmacies}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={SeparatorDash}
            style={styles.list}
            contentContainerStyle={styles.listContainer}
            footerTopAdornment={footerTopAdornment}
            ref={listRef}
          >
            {children}
          </FlatDataContainer>
        )}
      </View>
    </MapContext.Provider>
  );
};

// export const pharmacies = React.memo<Props>(PharmaciesBase);

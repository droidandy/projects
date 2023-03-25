import { StyleSheet } from 'react-native';
import { MapStyleElement } from 'react-native-maps';

import { theme } from '../../helpers/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  filter: {
    color: theme.white,
    flexShrink: 0,
    padding: theme.sizing(2),
  },
  segmentAll: {
    flex: 2,
  },
  segmentFavourites: {
    flex: 6,
  },
  segmentAroundTheClock: {
    flex: 8,
  },
  segmentHeart: {
    marginRight: theme.sizing(0.5),
  },
  list: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: theme.sizing(3),
  },
  tabsContainer: {
    borderColor: theme.green,
  },
  tabText: {
    color: theme.green,
  },
  activeTab: {
    backgroundColor: theme.green,
  },
});

export const mapStyles: MapStyleElement[] = [
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
];

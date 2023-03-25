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
    flexShrink: 0,
    padding: theme.sizing(2),
  },
  list: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: theme.sizing(3),
  },
  tabs: {
    margin: theme.sizing(1),
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

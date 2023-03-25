import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: StyleSheet.absoluteFillObject,
  flex: {
    flex: 1
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  indicatorView: {
    paddingVertical: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  items: {
    paddingHorizontal: 15,
    paddingTop: 20
  },
  contentContainer: {
    paddingBottom: 20
  }
});

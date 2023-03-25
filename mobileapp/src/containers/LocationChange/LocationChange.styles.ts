import { StyleSheet } from 'react-native';
import { theme } from '../../helpers/theme';

export const styles = StyleSheet.create({
  containerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  city: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: theme.sizing(6),
    paddingHorizontal: theme.sizing(1),
  },
  cityText: {
    flex: 1,
    fontFamily: theme.fonts.light,
    fontSize: 16,
    fontWeight: '300',
    color: theme.grayText,
  },
  location: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: theme.sizing(1),
  },
  icon: {
    flexShrink: 0,
    width: theme.sizing(2),
    height: theme.sizing(2),
    marginRight: theme.sizing(0.5),
  },
  locationCity: {
    flex: 1,
    fontFamily: theme.fonts.productHeading,
    fontSize: 20,
    color: theme.gray,
  },
  locationCitySelected: {
    flex: 1,
    fontFamily: theme.fonts.productHeading,
    fontSize: 20,
    color: theme.green,
  },
});

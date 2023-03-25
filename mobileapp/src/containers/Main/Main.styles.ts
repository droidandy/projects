import { StyleSheet } from 'react-native';
import { theme } from '../../helpers/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titles: {
    alignItems: 'center',
    marginTop: theme.sizing(3),
  },
  titlesText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 20,
    color: theme.gray,
    width: '80%',
  },
  lists: {
    marginTop: theme.sizing(2),
  },
  bottomSpace: {
    height: theme.sizing(3),
  },
});

export const headerStyles = StyleSheet.create({
  header: {
    display: 'flex',
    flex: 1,
    margin: theme.screenPadding.space,
    marginBottom: 0,
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerInputIcon: {
    flexShrink: 0,
    width: theme.sizing(2),
    height: theme.sizing(2),
    margin: theme.sizing(1),
  },
  headerLinks: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerLink: {
    padding: theme.sizing(1),
  },
  headerLinkIcon: {
    width: theme.sizing(2),
    height: theme.sizing(2),
    marginRight: theme.sizing(0.5),
  },
  headerLinkLocIcon: {
    width: theme.sizing(2),
    height: theme.sizing(2),
    padding: theme.sizing(1),
    marginRight: theme.sizing(0.25),
  },
  headerLinkText: {
    fontSize: 16,
  },
  headerLinkChevronIcon: {
    width: theme.sizing(3),
    height: theme.sizing(3),
    padding: 0,
    marginLeft: theme.sizing(1),
  },
});

export const sliderImageSizes = {
  width: 1920,
  height: 406,
};

export const sliderBottomImageSizes = {
  width: 474,
  height: 403,
  aspect: 474 / 403,
};

export const topSliderStyles = StyleSheet.create({
  container: {
    marginHorizontal: -theme.screenPadding.horizontal,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const bottomSliderStyles = StyleSheet.create({
  container: {
    marginHorizontal: -theme.screenPadding.horizontal,
    marginTop: theme.sizing(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const leadersSliderStyles = StyleSheet.create({
  container: {
    marginHorizontal: -theme.screenPadding.horizontal,
    marginTop: theme.sizing(2),
    alignItems: 'center',
  },
  slide: {
    marginHorizontal: theme.screenPadding.horizontal,
  },
});

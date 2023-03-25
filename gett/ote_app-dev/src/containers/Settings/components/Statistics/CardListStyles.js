import { StyleSheet } from 'react-native';

export default theme => StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 12
  },
  card: {
    margin: 3,
    justifyContent: 'center',
    width: 80,
    height: 56,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: theme.color.pixelLine,
    paddingHorizontal: 12
  },
  dateLabel: {
    fontSize: 12,
    color: theme.color.secondaryText
  },
  title: {
    fontWeight: '600',
    fontSize: 14
  },
  label: {
    fontSize: 10
  }
});

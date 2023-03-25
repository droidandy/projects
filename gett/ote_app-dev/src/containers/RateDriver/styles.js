import { StyleSheet } from 'react-native';

export default theme => StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: theme.color.bgPrimary
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  driverName: {
    color: theme.color.primaryText,
    fontSize: 20
  },
  vehicleDetails: {
    color: theme.color.secondaryText,
    marginTop: 8,
    fontSize: 15
  },
  label: {
    color: theme.color.primaryText,
    fontSize: 15
  },
  subLabel: {
    color: theme.color.secondaryText,
    marginTop: 8,
    fontSize: 12
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20
  },
  centerItems: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgesList: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  divider: {
    marginVertical: 36
  },
  badge: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.color.secondaryText,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    margin: 5
  },
  badgeActive: {
    borderColor: theme.color.pixelLine,
    backgroundColor: theme.color.pixelLine
  },
  badgeText: {
    color: theme.color.primaryText,
    fontSize: 15
  }
});

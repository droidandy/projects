import { StyleSheet } from 'react-native';

import { isIphoneX } from 'utils';

export default theme => StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    backgroundColor: theme.color.bgPrimary
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 77,
    marginLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.color.pixelLine,
    paddingRight: 8
  },
  button: {
    marginHorizontal: 12
  },
  image: {
    width: 110,
    height: 42
  },
  label: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 17,
    lineHeight: 28,
    color: theme.color.primaryText
  },
  modalWrapper: {
    paddingBottom: isIphoneX ? 24 : 16,
    paddingHorizontal: 16
  },
  modalContent: {
    backgroundColor: theme.color.bgPrimary
  },
  modalHeader: {
    color: theme.color.primaryText,
    fontSize: 20,
    marginTop: 8
  },
  carWrapper: {
    marginTop: 8,
    marginBottom: 10,
    height: 100
  },
  modalCarImage: {
    height: 70,
    width: 160,
    marginVertical: 8,
    position: 'absolute'
  },
  modalCarTypeWrapper: {
    bottom: 0,
    position: 'absolute'
  },
  modalCarInnerWrapper: {
    width: 64,
    height: 64
  },
  modalDesc: {
    color: theme.color.primaryText,
    fontSize: 14
  },
  featuresBlock: { paddingVertical: 8 },
  featuresItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4
  },
  featuresLabel: {
    color: theme.color.primaryText,
    fontSize: 14,
    paddingLeft: 12
  },
  feesDesc: {
    color: theme.color.secondaryText,
    fontSize: 11,
    marginTop: 8
  },
  logoService: {
    position: 'absolute',
    bottom: 2,
    left: 2
  },
  checkmark: {
    position: 'relative',
    width: 13,
    height: 13,
    overflow: 'hidden'
  },
  checkmarkHider: {
    width: 13,
    height: 13,
    backgroundColor: theme.color.bgPrimary,
    position: 'absolute',
    left: 0,
    top: 0
  }
});

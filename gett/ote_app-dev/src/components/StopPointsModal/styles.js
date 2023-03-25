import { StyleSheet } from 'react-native';

import { isIOS } from 'utils';

export default theme => StyleSheet.create({
  wrapper: {
    paddingBottom: 0,
    flex: 1,
    flexDirection: 'column'
  },
  rowWrapper: {
    backgroundColor: theme.color.bgPrimary,
    height: 60,
    paddingLeft: 45,
    paddingRight: 8
  },
  rowInnerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  dividerWrapper: {
    height: 2,
    width: '100%',
    paddingRight: 40
  },
  leftPanelContainer: {
    marginTop: 20,
    minHeight: 150
  },
  iconStyle: {
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1
  },
  plusBtnStyle: {
    color: theme.color.primaryBtns,
    fontWeight: 'bold',
    marginTop: -1,
    fontSize: 12,
    marginLeft: isIOS ? 1.5 : 0
  },
  counterItemContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dividerLineBtnStyle: {
    marginBottom: 1,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  counterTextStyle: {
    color: theme.color.secondaryText,
    fontSize: 10
  },
  counterRoundedWrapperStyle: {
    aspectRatio: 1,
    width: 20,
    marginBottom: 3,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.color.pixelLine,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listItem: {
    height: 60,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row'
  },
  listItemLabel: {
    fontSize: 16,
    paddingLeft: 0,
    flex: 1,
    alignItems: 'center',
    color: theme.color.primaryText
  },
  dragButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addButtonLabel: {
    fontSize: 16,
    color: theme.color.secondaryText,
    paddingLeft: 0,
    flex: 1
  },
  sortRowStyle: {
    overflow: 'visible',
    paddingTop: 3,
    paddingBottom: 3,
    elevation: 2,
    shadowColor: theme.color.primaryText,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {
      height: 0
    }
  },
  btnView: {
    marginHorizontal: 44,
    marginTop: 20,
    marginBottom: 26
  },
  orderPanel: {
    zIndex: 1,
    position: 'absolute',
    left: 0,
    top: 0
  }
});

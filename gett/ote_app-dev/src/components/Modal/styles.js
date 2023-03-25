import { StyleSheet } from 'react-native';

export const modalStyles = theme => StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0
  },
  container: {
    backgroundColor: theme.color.bgPrimary
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 7,
    paddingVertical: 7
  },
  defaultText: {
    paddingVertical: 8,
    paddingHorizontal: 13,
    fontSize: 14
  },
  closeText: {
    paddingVertical: 8,
    paddingHorizontal: 13,
    fontSize: 17,
    color: theme.color.primaryText,
    fontWeight: '500'
  },
  separator: {
    height: 16
  },
  containerSwipe: {
    position: 'absolute',
    top: -25,
    left: 0,
    width: '100%',
    height: 25,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  roundedRectangle: {
    backgroundColor: theme.color.arrowRight,
    width: 40,
    height: 5,
    borderRadius: 5
  }
});

export const optionsModalStyle = theme => StyleSheet.create({
  flex: {
    flex: 1
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0
  },
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 16
  },
  wrapper: {
    width: '100%',
    backgroundColor: theme.color.bgPrimary,
    borderRadius: 8
  },
  row: {
    width: '100%',
    height: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.color.pixelLine,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16
  },
  rowLast: {
    borderBottomWidth: 0
  },
  label: {
    paddingHorizontal: 16,
    fontSize: 17,
    fontWeight: '600',
    color: theme.color.primaryText
  },
  labelWithoutIcon: {
    paddingHorizontal: 0,
    paddingRight: 16
  },
  cancel: {
    marginTop: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

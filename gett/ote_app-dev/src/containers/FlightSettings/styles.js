import { StyleSheet } from 'react-native';

export default theme => StyleSheet.create({
  flex: {
    flex: 1
  },
  input: {
    fontSize: 16
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginTop: 26,
    marginBottom: 16
  },
  resultsWrapper: {
    marginHorizontal: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.color.pixelLine,
    borderRadius: 10
  },
  results: {
    flexDirection: 'row',
    minHeight: 36,
    alignItems: 'center'
  },
  resultTitle: {
    color: theme.color.primaryText,
    fontWeight: '600',
    width: '30%'
  },
  resultLabel: {
    color: theme.color.secondaryText,
    width: '60%'
  },
  verifyButton: {
    marginTop: 3,
    marginLeft: 12
  },
  error: {
    width: '100%'
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 24
  },
  tab: {
    flex: 1,
    borderBottomWidth: 2,
    paddingBottom: 16,
    borderBottomColor: theme.color.bgSecondary
  },
  activeTab: {
    borderBottomColor: theme.color.primaryText
  },
  tabLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  tabLabel: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.color.secondaryText
  },
  activeTabLabel: {
    color: theme.color.primaryText
  },
  tabIcon: {
    marginHorizontal: 4
  },
  saveButton: {
    paddingRight: 0
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

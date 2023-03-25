import { StyleSheet } from 'react-native';

export default theme => (
  StyleSheet.create({
    flex: {
      flex: 1
    },
    wrapper: {
      marginHorizontal: 20,
      flex: 1,
      height: 50,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    label: {
      fontSize: 15,
      color: theme.color[theme.isNightMode ? 'primaryText' : 'secondaryText']
    },
    labelMargin: {
      marginHorizontal: 10
    },
    labelCentered: {
      paddingLeft: 20,
      flex: 1
    },
    divider: {
      marginRight: 16
    }
  })
);

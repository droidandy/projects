import { StyleSheet } from 'react-native';

import { color } from 'theme';

const styles = StyleSheet.create({
  elevationContainer: {
    elevation: 2,
    shadowColor: color.black,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      height: 0
    }
  },
  buttonView: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    justifyContent: 'center'
  }
});

export default styles;

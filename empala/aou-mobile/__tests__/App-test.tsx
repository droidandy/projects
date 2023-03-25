import AsyncStorage from '@react-native-async-storage/async-storage';
// import 'react-native';
// import React from 'react';
// import App from '../App';
// import renderer from 'react-test-renderer';

// it('renders correctly', () => {
//   renderer.create(<App />);
// });

it('checks if Async Storage is used', async () => {
  expect(await AsyncStorage.getItem('myKey')).toBe(null);
});

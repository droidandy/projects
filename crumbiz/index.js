import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import store from './src/store';
import App from './src/App';
import { name as Crumbiz } from './app.json';
import { defaultTheme } from './src/themes';
import { ThemeProvider } from 'styled-components/native';
import 'react-native-gesture-handler';

const Root = () => (
	<ThemeProvider theme={defaultTheme}>
		<ReduxProvider store={store}>
			<App />
		</ReduxProvider>
	</ThemeProvider>
);

AppRegistry.registerComponent(Crumbiz, () => Root);

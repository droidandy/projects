import React from 'react';
import { render } from 'react-dom';
import AppContainer from 'react-hot-loader/lib/AppContainer';

export default function renderComponent(Component) {
  render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app')
  );
}

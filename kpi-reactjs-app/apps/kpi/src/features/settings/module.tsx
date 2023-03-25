import React from 'react';
import { SettingsView } from './components/SettingsView';
import { handle } from './interface';

// --- Module ---
export default () => {
  handle();
  return <SettingsView />;
};

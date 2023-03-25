import React from 'react';
import { DataSourcesView } from './components/DataSourcesView';
import { handle } from './interface';

// --- Module ---
export default () => {
  handle();
  return <DataSourcesView />;
};

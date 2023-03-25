import React from 'react';
import GoogleAnalytics from './GoogleAnalytics';
import { Route } from 'react-router-dom';

export default function attachAnalytics() {
  if (process.env.GOOGLE_ANALYTICS_ID) {
    return <Route path="/" component={ GoogleAnalytics } />;
  }
}

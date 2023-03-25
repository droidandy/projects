'use strict';

module.exports = {
  app: {
    title: 'Xthrift API',
    description: 'REST API for xthrift, an awesome mobile application for thrift stores',
    keywords: 'postgres, express, react, reactnative, thrift-stores, on-the-go-thrift-shopping, node.js, passport',
    googleAnalyticsTracingID: process.env.GOOGLE_ANALYTICS_TRACING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  port: process.env.PORT || 3000, 
  host: '127.0.0.1',
  templateEngine: 'swig',
  favicon: 'public/img/favicon.ico'
};

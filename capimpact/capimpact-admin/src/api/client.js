import { createClient } from 'react-fetching-library';

import {
  requestHostInterceptor,
  requestQueryInterceptor,
  requestAuthInterceptor,
} from './interceptors';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export const client = createClient({
  requestInterceptors: [
    requestHostInterceptor(API_URL),
    requestQueryInterceptor(),
    requestAuthInterceptor(),
  ],
});

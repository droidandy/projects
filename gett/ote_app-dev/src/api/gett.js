import Config from 'react-native-config';
import { isDevMode, GettApi, prepareDefaultProperties } from 'utils';
import { noop } from 'lodash';

const clientCredentials = {
  grantType: 'client_credentials',
  clientId: Config.GETT_CLIENT_ID,
  clientSecret: Config.GETT_CLIENT_SECRET,
  scope: 'relay'
};

const getAccessToken = () => (
  GettApi.post('/v1/oauth/token', {}, { params: clientCredentials })
    .catch(noop)
);

const prefix = `${isDevMode ? 'qa_ot_app' : 'ot_app'}|`;

const postEvent = (eventName = '', properties = {}) => (
  GettApi.post('/relay/v1/ru/metrics', {
    token: isDevMode ? Config.MIX_PANEL_DEV_API_KEY : Config.MIX_PANEL_API_KEY,
    eventName: `${prefix}${eventName}`,
    event: `${prefix}${eventName}`,
    ...prepareDefaultProperties(),
    ...properties
  })
    .catch(noop)
);

export default {
  getAccessToken,
  postEvent
};

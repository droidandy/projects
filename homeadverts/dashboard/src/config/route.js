import params from './params/index';

const host = params.API_HOST;
const route = {
  URL_INDEX: `${host}`,
  URL_LOGOUT: `${host}/logout`,
  URL_STREAM: `${host}/stream`,

  URL_SETTINGS: `${host}/profile/settings/edit/`,
  URL_BILLING: `${host}/profile/billing/`,
  URL_STATISTICS: `${host}/statistics/details/article`,
  URL_HELP: `${host}/help/z78`,
  URL_PROFILE: `${host}/profile`,

  URL_STORY_NEW: `${host}/story/new`,
  URL_STORY_IMPORT: `${host}/story/import`,

  API_USER_AUTHORIZE_SUCCESS: `${host}/api/user/me`,
  API_ROOM: `${host}/api/messenger/room`,
  API_ROOM_USER_JOIN: `${host}/api/messenger/room/user`,
  API_MESSAGE_SEND: `${host}/api/messenger/message/room`,
  API_MESSAGE_READ: `${host}/api/messenger/message`,

  API_PUSHER_AUTH: `${host}/api/user/pusher/authPresence`,
  API_PUSHER_ONLINE: `${host}/api/user/pusher/authOnline`,
  API_SEARCH_USER: `${host}/api/autocomplete/user`,
};

export default route;

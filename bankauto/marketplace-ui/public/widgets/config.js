function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const UUID_STORAGE_KEY = 'CHAT_UUID';

let uuid = window.localStorage && window.localStorage.getItem(UUID_STORAGE_KEY);
if (!uuid) {
  uuid = generateUUID();
  window.localStorage && window.localStorage.setItem(UUID_STORAGE_KEY, uuid);
}

if (!window._genesys) window._genesys = {};
if (!window._gt) window._gt = [];

window._genesys.widgets = {
  main: {
    themes: {
      bankauto: 'cx-theme-bankauto',
    },
    theme: 'bankauto',
    lang: 'ru',
    i18n: '/widgets/i18n/widgets-ru.i18n.json',
    customStylesheetID: 'genesys_widgets_custom',
    preload: [],
    mobileMode: 'auto',
    mobileModeBreakpoint: 600,
  },
  webchat: {
    userData: {
      uuid: uuid,
    },
    emojis: true,
    uploadsEnabled: false,
    form: {
      wrapper: '<table></table>',
      inputs: [
        {
          id: 'cx_webchat_form_firstname',
          name: 'firstname',
          maxlength: '100',
          placeholder: 'Имя',
          label: 'Имя',
          validateWhileTyping: true,
          validate: function (event, form, input, label, $, CXBus, Common) {
            if (input && input.val()) {
              return true;
            } else {
              return false;
            }
          },
        },
        {
          id: 'cx_webchat_form_lastname',
          name: 'lastname',
          maxlength: '100',
          placeholder: 'Фамилия',
          label: 'Фамилия',
          value: " ",
          styles: "display: none",
        },
      ],
    },
    cometD: {
      enabled: false,
    },
    autoInvite: {
      enabled: false,
      timeToInviteSeconds: 5,
      inviteTimeoutSeconds: 30,
    },
    chatButton: {
      enabled: true,
      openDelay: 1000,
      effectDuration: 300,
      hideDuringInvite: true,
    },
    dataURL: 'https://app-gen-gms-rgsb.open.ru/genesys/2/chat/not_auth_chat_BA',
    apikey: '',
    async: {
      enabled: false,
    },
  },
};

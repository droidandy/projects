// use https://fontdrop.info/  to see all glyphs

export type TVIconName = 'trash' | 'location' | 'list-bullet'
| 'arrow-bold' | 'arrow-down' | 'arrow-dropdown' | 'arrow-normal' | 'arrow-up'
| 'alert' | 'help' | 'checkmark' | 'info' | 'nav-back' | 'search'
| 'favorites' | 'warning' | 'notification' | 'notification-add'
| 'paperclip' | 'pencil' | 'news' | 'calendar' | 'calculator' | 'backspace' | 'eye'
| 'bio-face' | 'bio-finger' | 'back-phone' | 'close-button'
// operation
| 'operations' | 'operation-processing' | 'operation-refund' | 'operation-rejected' | 'operation-done'
| 'operation-replace' | 'operation-repeat'
// main
| 'portfel' | 'profile' | 'showcase' | 'quotes'
// output
| 'chart-pie' | 'chart-bar' | 'pdf' | 'document'
// contact
| 'iphone' | 'internet' | 'email' | 'whatsapp' | 'mail' | 'chat' | 'contact'
// currency
| 'dollar' | 'rubl' | 'euro'
// action
| 'ideas' | 'sort' | 'filter' | 'settings' | 'support' | 'confirm' | 'unlock' | 'upload' | 'close' | 'enter'
| 'exchange' | 'mail-send';

export type IVIconMap = { [N in TVIconName]: number };

export interface IVIconConfig {
  map: IVIconMap;
}

export const VIconConfigTid = Symbol.for('VIconConfigTid');

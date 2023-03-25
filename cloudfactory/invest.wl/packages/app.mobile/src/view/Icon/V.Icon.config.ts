// use https://fontdrop.info/  to see all glyphs
import { Injectable } from '@invest.wl/core';
import { IVIconConfig, IVIconMap } from '@invest.wl/view/src/Icon/V.Icon.types';

@Injectable()
export class VIconConfig implements IVIconConfig {
  public map = iconFontMap;
}

export const iconFontMap: IVIconMap = {
  'trash': 0x0066,
  'location': 0x0042, // - no
  'list-bullet': 0x0043, // - no
  'arrow-bold': 0x0044,
  'arrow-down': 0x0044,
  'arrow-dropdown': 0x0043,
  'arrow-normal': 0x0048,
  'arrow-up': 0x0068,
  'alert': 0x0046, // - no
  'chart-bar': 0x004A, // - no
  'help': 0x0051,
  'checkmark': 0x0049,
  'info': 0x0062,
  'contact': 0x004C,
  'document': 0x004E, // - no
  'mail': 0x004F, // - no
  'enter': 0x0050, // - no
  'mail-send': 0x0051, // - no
  'nav-back': 0x0055,
  'search': 0x0058,
  'notification': 0x0057,
  'notification-add': 0x0059,
  'operation-processing': 0x0055, // - no
  'operation-refund': 0x0056, // - no
  'operation-rejected': 0x0057, // - no
  'paperclip': 0x0058, // - no
  'pencil': 0x004B,
  'chart-pie': 0x0061, // - no
  'portfel': 0x0061,
  'profile': 0x0054,
  'warning': 0x0046,
  'showcase': 0x0065, // - no
  'upload': 0x0066, // - no
  'quotes': 0x0047,
  'close': 0x004A,
  'news': 0x006A, // - no
  'calendar': 0x006B, // - no
  'operation-done': 0x0052,
  'calculator': 0x006D, // - no
  'chat': 0x0042,
  'pdf': 0x006F, // - no
  'backspace': 0x0055,
  'bio-finger': 0x0065,
  'eye': 0x004e,
  'exchange': 0x0074, // - no
  'iphone': 0x0067,
  'internet': 0xE901, // - no
  'email': 0xE902, // - no
  'whatsapp': 0x0046,
  'sort': 0xE904, // - no
  'bio-face': 0x004F,
  'back-phone': 0x0041,
  'close-button': 0x0044, // - no
  'dollar': 0x004D,
  'favorites': 0x0050,
  'ideas': 0x0053,
  'filter': 0x0056,
  'operations': 0x005A,
  'rubl': 0x0063,
  'settings': 0x0064,
  'euro': 0x0069,
  'support': 0x0069, // - no
  'confirm': 0x0069, // - no
  'unlock': 0x0069, // - no
};

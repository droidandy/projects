import { IVInstrumentQuoteListPresentProps } from '../Instrument/V.Instrument.types';

export enum EVLayoutScreen {
  LayoutManual = 'LayoutManual',
  LayoutEntry = 'LayoutEntry',
  LayoutMain = 'LayoutMain',
  LayoutWebView = 'LayoutWebView',
  LayoutLaunch = 'LayoutLaunch',
  LayoutSettings = 'LayoutSettings',

  LayoutMenu = 'LayoutMenu',
  LayoutOperationMenu = 'LayoutOperationMenu',

  LayoutPortfelStack = 'LayoutPortfelStack',
  LayoutInstrumentStack = 'LayoutInstrumentStack',
  LayoutShowcaseStack = 'LayoutShowcaseStack',
  LayoutProfileStack = 'LayoutProfileStack',

  LayoutOperationTabs = 'LayoutOperationTabs',
  LayoutQuoteTabs = 'LayoutQuoteTabs',
  LayoutInstrumentAlertTabs = 'LayoutInstrumentAlertTabs',
}

export interface IVLayoutWebViewScreenProps {
  url: string;
  html?: string;
  title: string;
  externalLinkInBrowser?: boolean;
  incognito?: boolean;
}

export interface IVLayoutMenuScreenProps {
}

export interface IVLayoutSettingsScreenProps {
}


export interface IVLayoutScreenParams {
  LayoutLaunch: {};
  LayoutManual: {};
  LayoutEntry: {};
  LayoutMain: {};
  LayoutWebView: IVLayoutWebViewScreenProps;
  LayoutSettings: IVLayoutSettingsScreenProps;

  LayoutMenu: IVLayoutMenuScreenProps;
  LayoutOperationMenu: IVLayoutMenuScreenProps;

  LayoutPortfelStack: {};
  LayoutInstrumentStack: {};
  LayoutShowcaseStack: {};
  LayoutProfileStack: {};

  LayoutInstrumentAlertTabs: {};
  LayoutOperationTabs: {};
  LayoutQuoteTabs: IVInstrumentQuoteListPresentProps;
}

export interface IVLayoutScreenProps {
  inFocus: boolean;
}

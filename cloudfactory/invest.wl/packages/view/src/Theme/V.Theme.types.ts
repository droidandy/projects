export const VThemeStoreTid = Symbol.for('VThemeStoreTid');
export const VThemeAdapterTid = Symbol.for('VThemeAdapterTid');

export interface IVThemeModelProps {
  readonly name: string;
  readonly color: IVThemeColor;
  readonly space: IVThemeSpace;
  readonly font: IVThemeFont;
  readonly kit: IVThemeKit;
}

export interface IVThemeModel extends IVThemeModelProps {
}

export interface IVThemeAdapter {
  readonly list: IVThemeModel[];
}

export type TVThemeSizeBase = 'sm' | 'md' | 'lg';
export type TVThemeSize = 'xs' | TVThemeSizeBase | 'xl';
export type TVThemeSizeName = TVThemeSize;
export type IVThemeSizeMap = { [S in TVThemeSize]?: number };

export type TVThemeColorValue = string;
export type TVThemeColorArea = 'cMain' | 'cBg' | 'cText' |
'cActive' | 'cInactive' | 'cDisabled' | 'cBorder' | 'cPositive' | 'cNegative' |
// deprecated
'cTitle';

export type TThemeSizeNumeric = number;
export type TThemeSizeValue = TVThemeSizeName | TThemeSizeNumeric;
export type TVThemeSizeArea = 'sMargin' | 'sPadding' | 'sWidth' | 'sHeight' | 'sRadius' | 'sDiameter' | 'sFont'
| 'sBorder';
export type TVThemeFontArea = 'fText' |
// deprecated
'fTitle' | 'fCaption' |
'fNumInt' | 'fNumIntBig' | 'fNumFloatBig' | 'fNumFloat';

export interface IVThemeStore {
  init(): Promise<void>;
  currentSet(theme: IVThemeModel, withoutRestart?: boolean): void;

  readonly current: IVThemeModel;
  readonly color: IVThemeColor;
  readonly space: IVThemeSpace;
  readonly font: IVThemeFont;
  readonly kit: IVThemeKit;
}

export interface IVThemeColor {
  // end
  readonly base: TVThemeColorValue;
  readonly baseContrast: TVThemeColorValue;
  readonly baseInvert: TVThemeColorValue;

  readonly text: TVThemeColorValue;
  readonly link: TVThemeColorValue;

  readonly bg: TVThemeColorValue;
  readonly bgContent: TVThemeColorValue;
  readonly overlay: TVThemeColorValue;

  readonly decorLight: TVThemeColorValue;
  readonly decor: TVThemeColorValue;
  readonly decorDark: TVThemeColorValue;

  readonly negativeLight: TVThemeColorValue;
  readonly negative: TVThemeColorValue;
  readonly waiting: TVThemeColorValue;
  readonly positiveLight: TVThemeColorValue;
  readonly positive: TVThemeColorValue;

  readonly muted1: TVThemeColorValue;
  readonly muted2: TVThemeColorValue;
  readonly muted3: TVThemeColorValue;
  readonly muted4: TVThemeColorValue;

  readonly primary1: TVThemeColorValue;
  readonly primary2: TVThemeColorValue;
  readonly primary3: TVThemeColorValue;

  readonly accent1: TVThemeColorValue;
  readonly accent2: TVThemeColorValue;
}

export type IVThemeSpace = {
  [S in TVThemeSize]: number;
};

export interface IVThemeFontItem {
  fontFamily: string;
  fontSize: number;

  fontStyle?: 'normal' | 'italic';
  fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | undefined;
  lineHeight?: number;
  color?: TVThemeColorValue;
  letterSpacing?: number;
  textDecorationLine?: 'underline';
}

export interface IVThemeFont {
  readonly title2: IVThemeFontItem;
  readonly title3: IVThemeFontItem;
  readonly title5: IVThemeFontItem;
  readonly body1: IVThemeFontItem;
  readonly body2: IVThemeFontItem;
  readonly body3: IVThemeFontItem;
  readonly body4: IVThemeFontItem;
  readonly body5: IVThemeFontItem;
  readonly body6: IVThemeFontItem;
  readonly body7: IVThemeFontItem;
  readonly body8: IVThemeFontItem;
  readonly body9: IVThemeFontItem;
  readonly body10: IVThemeFontItem;
  readonly body11: IVThemeFontItem;
  readonly body12: IVThemeFontItem;
  readonly body13: IVThemeFontItem;
  readonly body14: IVThemeFontItem;
  readonly body15: IVThemeFontItem;
  readonly body16: IVThemeFontItem;
  readonly body17: IVThemeFontItem;
  readonly body18: IVThemeFontItem;
  readonly body19: IVThemeFontItem;
  readonly body20: IVThemeFontItem;
  readonly body21: IVThemeFontItem;
  readonly body22: IVThemeFontItem;
  readonly caption2: IVThemeFontItem;
}

export type TVThemeFont = keyof IVThemeFont;
export type TVThemeKit = keyof IVThemeKit;
export type TVThemeColor = keyof IVThemeColor;

// KIT
export interface IVThemeKit {
  // Decoration
  readonly Shadow: TVThemeComponentItem & { opacity: number; radius: number };

  // Feedback
  readonly ProgressBar: TVThemeComponentItem & { line: TVThemeComponentItem; text: TVThemeComponentItem };
  readonly Spinner: TVThemeComponentItem;
  readonly Stub: {
    Empty: TVThemeComponentItem & { image: TVThemeComponentItem; title: TVThemeComponentItem; text: TVThemeComponentItem };
    Error: TVThemeComponentItem;
  };

  // Input
  readonly Button: TVThemeComponentItem & {
    icon: TVThemeComponentItem;
    Close: TVThemeComponentItem & { icon: TVThemeComponentItem };
    Setting: TVThemeComponentItem & { icon: TVThemeComponentItem };
  };
  readonly CheckBox: TVThemeComponentItem & { icon: TVThemeComponentItem; text: TVThemeComponentItem };
  readonly InputField: TVThemeComponentItem & {
    input: TVThemeComponentItem; label: TVThemeComponentItem;
    placeholder: TVThemeComponentItem; backspace: TVThemeComponentItem;
    float: TVThemeComponentItem; slider: TVThemeComponentItem;
    hint: TVThemeComponentItem; error: TVThemeComponentItem;
  };
  readonly PinPad: TVThemeComponentItem & {
    title: TVThemeComponentItem;
    button: TVThemeComponentItem; dot: TVThemeComponentItem;
    number: TVThemeComponentItem; icon: TVThemeComponentItem;
  };
  readonly Select: TVThemeComponentItem & {
    Dropdown: TVThemeComponentItem & { header: TVThemeComponentItem; body: TVThemeComponentItem & { line: TVThemeComponentItem } };
    Period: TVThemeComponentItem & { modal: TVThemeComponentItem; title: TVThemeComponentItem; button: TVThemeComponentItem };
    Tab: TVThemeComponentItem & { line: TVThemeComponentItem; text: TVThemeComponentItem };
    Button: TVThemeComponentItem & { text: TVThemeComponentItem; item: TVThemeComponentItem };
    Radio: TVThemeComponentItem & { text: TVThemeComponentItem; checked: TVThemeComponentItem; unchecked: TVThemeComponentItem };
    Tag: TVThemeComponentItem;
  };
  readonly Slider: TVThemeComponentItem;
  readonly Switch: TVThemeComponentItem & { thumb: TVThemeComponentItem; track: TVThemeComponentItem };
  readonly SwitchField: TVThemeComponentItem;

  // Layout
  readonly Container: TVThemeComponentItem;
  readonly Content: TVThemeComponentItem;
  readonly ModalDialog: TVThemeComponentItem & { close: TVThemeComponentItem; title: TVThemeComponentItem; text: TVThemeComponentItem };
  readonly ModalBottom: TVThemeComponentItem & { close: TVThemeComponentItem };
  readonly StatusBar: TVThemeComponentItem & { barStyle: 'light-content' | 'dark-content' };

  // Nav
  readonly NavBar: TVThemeComponentItem & {
    shadow?: any;
    title: TVThemeComponentItem; titleSub: TVThemeComponentItem; top?: TVThemeComponentItem;
  };
  readonly NavBarIcon: TVThemeComponentItem;
  readonly NavBarInput: TVThemeComponentItem;
  readonly NavBarText: TVThemeComponentItem;
  readonly Tabs: {
    Header: TVThemeComponentItem & {
      line: TVThemeComponentItem; item: TVThemeComponentItem;
    };
    Footer: TVThemeComponentItem & {
      item: TVThemeComponentItem; icon: TVThemeComponentItem;
    };
  };

  // Output
  readonly Badge: TVThemeComponentItem;
  readonly Chart: {
    Line: TVThemeComponentItem & { x: TVThemeComponentItem; y: TVThemeComponentItem; empty: TVThemeComponentItem };
    Marker: TVThemeComponentItem &
    { offsetY: TVThemeComponentItem; x: TVThemeComponentItem; y: TVThemeComponentItem; arrow: TVThemeComponentItem; line: TVThemeComponentItem; circle: TVThemeComponentItem };
  };
  readonly Format: {
    Number: TVThemeComponentItem & {
      int: { [S in TVThemeSizeBase]?: TVThemeComponentItem };
      float: { [S in TVThemeSizeBase]?: TVThemeComponentItem };
    };
  };
  readonly Hyperlink: TVThemeComponentItem;
  readonly Filter: TVThemeComponentItem & {
    title: TVThemeComponentItem; state: TVThemeComponentItem;
    button: TVThemeComponentItem;
    list: TVThemeComponentItem & { header: TVThemeComponentItem };
  };
  readonly ListSeparator: TVThemeComponentItem;
  readonly Thumbnail: TVThemeComponentItem;
  readonly Tooltip: TVThemeComponentItem & { icon: TVThemeComponentItem; text: TVThemeComponentItem };

  // Surface
  readonly Card: TVThemeComponentItem;
  readonly Collapsible: TVThemeComponentItem & { button: TVThemeComponentItem; icon: TVThemeComponentItem };
  readonly Disclaimer: TVThemeComponentItem & { title: TVThemeComponentItem; icon: TVThemeComponentItem };
  readonly Carousel: TVThemeComponentItem & { dot: TVThemeComponentItem };

  // @deprecated
  readonly Swiper: TVThemeComponentItem & { dot: TVThemeComponentItem };
}

type TVThemeComponentItem =
  { [S in TVThemeSizeArea]?: IVThemeSizeMap; } &
  // массив цветов предполагает градиент
  { [C in TVThemeColorArea]?: TVThemeColorValue | TVThemeColorValue[]; } &
  { [F in TVThemeFontArea]?: IVThemeFontItem; } &
  { [key: string]: any };


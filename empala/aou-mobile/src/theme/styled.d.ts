// import original module declaration
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    name?: string;

    colors: {
      White: string;
      Black: string;
      Green200: string;
      Grey200: string;
      Grey300: string;
      Grey400: string;
      Grey600: string;
      Grey800: string;
      Geyser: string;
      GreyDarkest: string;
      GreyGull: string;
      GreyLoader: string;
      Dark: string;
      BrandBlue200: string;
      Greenish: string;
      BrandBlue600: string;
      Darkblue: string;
      Red: string;
      ModalBackground: string;
      UIErrorDark: string;
    };

    formatterColor: {
      Dark50: string;
      Dark200: string;
      Dark400: string;
      Dark660: string;
      Dark800: string;
      Bubble: string;
      Darkblue: string;
      Light200: string;
      Light400: string;
      Light600: string;
      Light800: string;
      Light900: string;
      ModalBackground: string;
    }
  }
}

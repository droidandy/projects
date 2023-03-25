import { VThemeModel } from '@invest.wl/view/src/Theme/model/V.Theme.model';
import { Platform, StatusBar } from 'react-native';
import { colors } from '../value/colors';
import { textStyles } from '../value/textStyles';

export const VThemeDefaultVariant = new VThemeModel(
  {
    name: 'default',
    color: {
      base: colors.white,
      baseInvert: colors.black,
      baseContrast: colors.baseContrast,

      bg: colors.white,
      bgContent: colors.bgContent,

      text: colors.text,
      link: colors.blue,

      overlay: colors.bgContent,

      decorLight: colors.decorLight,
      decor: colors.decorMedium,
      decorDark: colors.decorGray,

      positiveLight: colors.green1,
      positive: colors.green2,
      waiting: colors.orange1,
      negativeLight: colors.negativeLight,
      negative: colors.negativeNormal,

      muted1: colors.gray1,
      muted2: colors.gray2,
      muted3: colors.gray3,
      muted4: colors.gray4,

      primary1: colors.green1,
      primary2: colors.green2,
      primary3: colors.green4,

      accent1: colors.orange1,
      accent2: colors.orange2,
    },
    space: {
      xs: 2,
      sm: 4,
      md: 10,
      lg: 20,
      xl: 32,
    },
    font: {
      title2: textStyles.title2,
      title3: textStyles.title3,
      title5: textStyles.title5,
      body1: textStyles.body1,
      body2: textStyles.body2,
      body3: textStyles.body3,
      body4: textStyles.body4,
      body5: textStyles.body5,
      body6: textStyles.body6,
      body7: textStyles.body7,
      body8: textStyles.body8,
      body9: textStyles.body9,
      body10: textStyles.body10,
      body11: textStyles.body11,
      body12: textStyles.body12,
      body13: textStyles.body13,
      body14: textStyles.body14,
      body15: textStyles.body15,
      body16: textStyles.body16,
      body17: textStyles.body17,
      body18: textStyles.body18,
      body19: textStyles.body19,
      body20: textStyles.body20,
      body21: textStyles.body21,
      body22: textStyles.body22,
      caption2: textStyles.caption2,
    },
    kit: {
      // Decoration
      Shadow: {
        cMain: colors.text,
        sWidth: { md: 0 },
        sHeight: { md: 2 },
        radius: 4,
        opacity: 0.25,
      },

      // Feedback
      ProgressBar: {
        sHeight: { md: 2 },
        sRadius: { md: 2 },
        cBg: colors.gray1,
        line: {
          cBg: colors.green2,
        },
        text: {
          fText: textStyles.body20,
          cText: colors.green2,
          cBg: colors.white,
        },
      },
      Spinner: {
        cMain: colors.decorGray,
      },
      Stub: {
        Empty: {
          image: { sMargin: { md: 20 } },
          title: {
            fText: textStyles.title2,
            sMargin: { md: 10 },
            cText: colors.gray4,
          },
          text: {
            fText: textStyles.body8,
            sMargin: { md: 20 },
            cText: colors.gray4,
          },
        },
        Error: {
          sPadding: { md: 32 },
          fText: textStyles.body8,
          cText: colors.gray4,
        },
      },

      // Input
      Button: {
        sBorder: { md: 1 },
        sRadius: { md: 12 },
        sHeight: { sm: 32, md: 48, lg: 58 },
        icon: {
          sFont: { sm: 12, md: 14, lg: 14 },
        },
        cDisabled: colors.gray2,
        cMain: colors.green2,
        cText: colors.base,
        fText: textStyles.body11,

        Close: {
          cBg: colors.decorLight,
          sRadius: { md: 12 },
          sWidth: { md: 24 },
          sHeight: { md: 24 },
          icon: {
            sFont: { md: 12 },
            cMain: colors.decorGray,
          },
        },
        Setting: {
          cBg: colors.base,
          cText: colors.text,
          fText: textStyles.body9,
          sHeight: { md: 48 },
          sPadding: { md: 20 },
          icon: {
            cBorder: colors.gray3,
            sFont: { md: 24 },
            sMargin: { md: 14 },
            cMain: colors.text,
          },
        },
      },
      CheckBox: {
        sWidth: { md: 20 }, sHeight: { md: 20 },
        sRadius: { md: 4 }, sBorder: { md: 2 },
        cInactive: colors.decorMedium,
        cActive: colors.positiveNormal,
        text: {
          sMargin: { md: 10 },
          cActive: colors.baseContrast,
          cInactive: colors.decorGray,
          fText: textStyles.body6,
        },
        icon: {
          sFont: { md: 12 },
          cMain: colors.base,
        },
      },
      InputField: {
        sHeight: { md: 48 },
        sPadding: { md: 16 },
        cDisabled: colors.decorLight,
        cBorder: colors.gray1,
        sBorder: { md: 1 },
        sRadius: { md: 10 },
        label: {
          cText: colors.text,
          fText: textStyles.body7,
        },
        placeholder: {
          cText: colors.gray3,
          fText: textStyles.body7,

        },
        input: {
          cText: colors.baseContrast,
          fText: textStyles.body9,
        },
        backspace: {
          cMain: colors.decorGray,
          sFont: { md: 18 },
        },
        float: {
          cBg: colors.base,
          cBorder: colors.decorMedium,
          sMargin: { md: 16 },
          fText: textStyles.body8,
        },
        slider: {
          sHeight: { md: 16 },
        },
        hint: {
          cText: colors.gray3,
          fText: textStyles.body20,
          sPadding: { md: 4 },
        },
        error: {
          sMargin: { md: 4 },
          sHeight: { md: 16 },
          cText: colors.negativeNormal,
          cMain: colors.negativeNormal,
          cBg: 'rgba(250, 235, 235, 0.5)',
          fText: textStyles.body20,
          sPadding: { md: 4 },
        },
      },
      PinPad: {
        title: {
          cText: colors.text,
          fText: textStyles.body9,
          sMargin: { md: 12 },
        },
        button: {
          sWidth: { md: 75 },
          sMargin: { md: 25 },
          sRadius: { md: 75 },
        },
        dot: {
          cBorder: colors.text,
          cActive: colors.text,
          // cInactive: colors.text,
          cDisabled: colors.gray3,
          sWidth: { md: 6 },
          sBorder: { md: 1 },
          sMargin: { md: 10 },
        },
        number: {
          cBg: colors.gray3,
          cText: colors.white,
          cDisabled: colors.gray1,
          fText: textStyles.title2,
        },
        icon: {
          cMain: colors.gray3,
          sFont: { md: 20 },
        },
      },
      Select: {
        Button: {
          sHeight: { md: 36 },
          sRadius: { md: 8 },
          item: {
            sPadding: { md: 20 },
            cInactive: colors.decorLight,
            cActive: colors.green3,
            // если указан - между кнопками будет расстояние и будет работать радиус для кнопок
            sMargin: { md: 8 },
            sRadius: { md: 18 },
          },
          text: {
            fText: textStyles.body5,
            cInactive: colors.decorGray,
            cActive: colors.white,
          },
        },
        Tab: {
          sPadding: { md: 10, lg: 20, xs: 2, sm: 4 },
          sBorder: { md: 2 },
          text: {
            fText: textStyles.body5,
            cInactive: colors.gray4,
            cActive: colors.text,
          },
          line: {
            sHeight: { md: 2 },
            cInactive: colors.gray2,
            cActive: colors.green3,
          },
        },
        Radio: {
          sPadding: { md: 14 },
          text: {
            sMargin: { md: 10 },
            fText: textStyles.body8,
            cInactive: colors.decorGray,
            cActive: colors.baseContrast,
          },
          checked: {
            cText: colors.white,
            cBorder: colors.green2,
            // cBg: colors.white,
            cBg: [colors.greenGradient[0], colors.greenGradient[1]],
            sHeight: { md: 20 },
            sWidth: { md: 20 },
            sRadius: { md: 10 },
            sFont: { md: 10 },
            // sBorder: { md: 2 },
          },
          unchecked: {
            cMain: 'transparent',
            cBorder: colors.green2,
            sHeight: { md: 20 },
            sWidth: { md: 20 },
            sRadius: { md: 10 },
            // sBorder: { md: 2 },
          },
        },
        Tag: {
          sWidth: { md: 32 },
          sHeight: { md: 18 },
          sRadius: { md: 10 },
          cBg: colors.gray3,
          cActive: colors.base,
          cInactive: colors.text,
          fText: textStyles.caption2,
        },
        Dropdown: {
          sPadding: { md: 20 },
          header: {
            fTitle: textStyles.title5,
          },
          body: {
            sPadding: { md: 20 },
            line: {
              sPadding: { md: 20 },
              sBorder: { md: 0.5 },
              cBorder: colors.decorDark,
            },
          },
        },
        Period: {
          title: { sMargin: { md: 12 } },
          modal: {
            cText: colors.baseContrast,
            fText: textStyles.body4,
            sPadding: { md: 20 },
            sMargin: { md: 20 },
          },
          button: { sMargin: { md: 32 } },
        },
      },
      Slider: {
        cMain: colors.green1,
        cPositive: colors.green2,
        cNegative: colors.decorMedium,
      },
      SwitchField: {
        sMargin: { md: 20 },
        sHeight: { md: 48 },
        cBg: colors.base,
        cText: colors.text,
        fText: textStyles.body9,
        cBorder: colors.gray1,
        sBorder: { md: 1 },
      },
      Switch: {
        thumb: {
          cDisabled: colors.gray2,
          cActive: colors.white,
          cInactive: colors.white,
        },
        track: {
          cDisabled: colors.gray4,
          cActive: colors.green1,
          cInactive: colors.gray2,
        },
      },

      // Layout
      Container: {
        cBg: colors.white,
      },
      Content: {
        cBg: colors.bgContent,
      },
      ModalBottom: {
        cBg: colors.base,
        sRadius: { md: 20 },
        close: {
          cBg: colors.gray3,
          sRadius: { md: 15 },
          sHeight: { md: 5 },
          sWidth: { md: 30 },
          sPadding: { md: 8 },
        },
      },
      ModalDialog: {
        cBg: colors.base,
        sRadius: { md: 20 },
        title: {
          fText: textStyles.title5,
          cText: colors.text,
        },
        text: {
          fText: textStyles.body13,
          cText: colors.text,
        },
        close: {
          sMargin: { md: 12 },
        },
      },
      StatusBar: {
        // TODO: пока в NavBar не внедрен RNStatusBar, он приезжает из системы и видимо не имеет высоты, т.к. "вне приложения"
        sHeight: { md: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight },
        cBg: colors.white,
        barStyle: 'dark-content',
      },
      // Nav
      NavBar: {
        cBg: colors.base,
        sHeight: { md: 40 },
        sPadding: { md: 20 },
        // top: { sRadius: { md: 18 } },
        title: {
          fText: textStyles.body2,
          cText: colors.text,
        },
        titleSub: {
          sMargin: { md: 2 },
          fText: textStyles.body20,
          cText: colors.gray3,
        },
        // shadow: shadowStyle(1),
      },
      NavBarIcon: {
        sFont: { md: 18 },
        cMain: colors.gray3,
      },
      NavBarInput: {
        sHeight: { md: 32 },
        cBg: colors.gray1,
      },
      NavBarText: {
        fText: textStyles.body18,
        cText: colors.text,
      },
      Tabs: {
        Footer: {
          sHeight: { md: 60 },
          sRadius: { md: 30 },
          cBg: colors.base,
          item: {
            cActive: colors.orange2,
            cInactive: colors.gray3,
            sMargin: { md: 4 },
            fTitle: textStyles.body20,
          },
          icon: {
            sFont: { md: 20 },
          },
        },
        Header: {
          cBg: colors.white,
          cBorder: colors.gray1,
          sHeight: { md: 48 },
          sPadding: { md: 20 },
          item: {
            sMargin: { md: 24 },
            sFont: { md: 22 },
            cActive: colors.text,
            cInactive: colors.gray3,
            fText: textStyles.body12,
          },
          line: {
            sHeight: { md: 2 },
            cBg: colors.greenGradient,
          },
        },
      },

      // Output
      Badge: {
        cBg: colors.negativeLight,
        cText: colors.white,
        sDiameter: { sm: 20, md: 24 },
        sPadding: { sm: 4, md: 5 },
        sFont: { sm: 10, md: 12 },
        fText: textStyles.body16,
      },
      Chart: {
        Line: {
          empty: {
            sMargin: { md: 20 },
            cText: colors.gray4,
          },
          x: {
            fText: textStyles.body20,
            cText: colors.gray3,
          },
          y: {
            cBg: colors.bgContent,
            fText: textStyles.body20,
            cText: colors.gray3,
            cBorder: colors.gray2,
            sPadding: { md: 4 },
            sRadius: { md: 5 },
          },
        },
        Marker: {
          cBg: colors.white,
          sMargin: { md: 10 },
          sPadding: { md: 8 },
          sRadius: { md: 8 },
          arrow: {
            sHeight: { md: 16 },
            sWidth: { md: 8 },
          },
          line: {
            cBg: colors.green4,
            sWidth: { md: 1 },
          },
          circle: {
            cBg: colors.white,
            cBorder: colors.green4,
            sWidth: { md: 15 },
            sBorder: { md: 4 },
          },
          offsetY: {
            sMargin: { md: 4 },
          },
          x: {
            fText: textStyles.body20,
            cText: colors.gray4,
          },
          y: {
            fText: textStyles.body13,
            cText: colors.text,
          },
        },
      },
      Format: {
        Number: {
          int: {
            sm: { fText: textStyles.body4, cText: colors.text },
            md: { fText: textStyles.body4, cText: colors.text },
            lg: { fText: textStyles.title2, cText: colors.text },
          },
          float: {
            sm: { fText: textStyles.body19, cText: colors.gray3 },
            md: { fText: textStyles.body19, cText: colors.gray3 },
            lg: { fText: textStyles.title3, cText: colors.gray3 },
          },
        },
      },
      Hyperlink: {
        cMain: colors.green2,
      },
      Filter: {
        cBg: colors.base,
        sPadding: { md: 20 },
        sRadius: { md: 20 },
        title: {
          fText: textStyles.body3,
          cText: colors.text,
          sMargin: { md: 10 },
        },
        state: {
          fText: textStyles.body12,
          cActive: colors.green1,
          cInactive: colors.gray3,
        },
        list: {
          sPadding: { md: 20 },
          header: {
            sPadding: { md: 20 },
            fText: textStyles.title5,
          },
        },
        button: {
          sMargin: { md: 20 },
        },
      },
      ListSeparator: {
        cBg: colors.gray1,
        sMargin: { md: 20 },
        sHeight: { md: 1 },
      },
      Thumbnail: {
        sWidth: { md: 48 },
        sRadius: { md: 12 },
        sFont: { md: 16 },
      },
      Tooltip: {
        sMargin: { md: 4 },
        icon: {
          sFont: { md: 16 },
          cMain: colors.decorGray,
          sMargin: { md: -2 },
        },
        text: {
          fText: textStyles.body12,
          sPadding: { md: 32 },
        },
      },

      // Surface
      Card: {
        sRadius: { md: 15 },
        cBg: colors.white,
      },
      Collapsible: {
        sHeight: { md: 44 },
        sMargin: { md: 20 },
        button: {
          fText: textStyles.body8,
          cText: colors.green1,
        },
        icon: {
          cMain: colors.decorGray,
          sFont: { md: 14 },
        },
      },
      Disclaimer: {
        sPadding: { md: 10 },
        sMargin: { md: 16 },
        cText: colors.decorGray,
        fText: textStyles.body12,
        title: {
          fText: textStyles.body4,
          cText: colors.baseContrast,
        },
        icon: {
          sFont: { md: 16 },
          cBg: colors.base,
          cMain: colors.white,
          sRadius: { md: 8 },
          sPadding: { md: 10 },
        },
      },
      Swiper: {
        sMargin: { md: 10 },
        dot: {
          sWidth: { md: 6 },
          cActive: colors.orange2,
          cInactive: colors.gray2,
          sMargin: { md: 4 },
        },
      },
      Carousel: {
        sMargin: { md: 10 },
        dot: {
          sWidth: { md: 6 },
          cActive: colors.orange2,
          cInactive: colors.gray2,
          sMargin: { md: 4 },
        },
      },
    },
  },
);

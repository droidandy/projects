// TODO: use this theme vars?

// export const SMALL_SCREEN_HEIGHT = 640;
// export const SMALL_SCREEN_WIDTH = 350;
// export const MEDIA_SMALL_SCREEN_HEIGHT_KEY = `@media (max-height: ${SMALL_SCREEN_HEIGHT})`;
// export const MEDIA_SMALL_SCREEN_WIDTH_KEY = `@media (max-width: ${SMALL_SCREEN_WIDTH})`;
//
// const deviceHeight = DimensionsHeight;
// const deviceWidth = DimensionsWidth;
// export const fontScaleFactor = deviceWidth < SMALL_SCREEN_WIDTH ? 0.8 : 1;
// export const isDeviceNarrow = deviceWidth <= SMALL_SCREEN_WIDTH || deviceHeight <= SMALL_SCREEN_HEIGHT;
//
// // см. https://www.paintcodeapp.com/news/ultimate-guide-to-iphone-resolutions
// export function isIphoneXGeneration() {
//   return (
//     Platform.OS === 'ios' &&
//     !(Platform as any).isPad &&
//     !(Platform as any).isTVOS &&
//     (
//       (deviceWidth === 375 && deviceHeight === 812 || deviceWidth === 812 && deviceHeight === 375) || // iPhone X, Xs
//       (deviceWidth === 414 && deviceHeight === 896 || deviceWidth === 896 && deviceHeight === 414) // iPhone Xr, Xs Max
//     )
//   );
// }
//
// export function isIphone5Generation() {
//   return (
//     Platform.OS === 'ios' &&
//     !(Platform as any).isPad &&
//     !(Platform as any).isTVOS &&
//     (deviceWidth <= 320)
//   );
// }
//
// // https://stackoverflow.com/a/49174154
// const safeAreaTop = 44;
// const safeAreaBottom = 34;
// const safeAreaBottomLandscape = 24;
// const isSafeAreaNeeded = isIphoneXGeneration();
//
// // TODO: remove. move vars to THEME
//
// /**
//  * @deprecated
//  * Можно использовать в коде напрямую.
//  */
// export const themeVars = {
//   double: {
//     space: {
//       xs: themeSpaces.xs * 2,
//       md: themeSpaces.md * 2,
//       lg: themeSpaces.lg * 2,
//     },
//   },
//   global: {
//     deviceHeight, deviceWidth,
//     fontScale: (deviceHeight > deviceWidth ? deviceWidth : deviceHeight) /
//       (Platform.OS === 'ios' ? deviceWidth > 768 ? 768 : 375 : deviceWidth >= 600 ? 600 : 375),
//     // TODO: пока в NavBar не внедрен RNStatusBar, он приезжает из системы и видимо не имеет высоты, т.к. "вне приложения"
//     statusBarHeight: Platform.OS === 'ios' ? (isSafeAreaNeeded ? safeAreaTop : 20) : 0, // StatusBar.currentHeight,
//     // на iPhone X в горизонтальном положении нет статус бара
//     statusBarHeightLandscape: Platform.OS === 'ios' ? (isSafeAreaNeeded ? 0 : 20) : StatusBar.currentHeight,
//     keyboardVerticalOffset: 0,
//     appHeaderHeight: '$var.AppHeader.minHeight + $var.global.statusBarHeight',
//     passwordAutoFillHeight: 45,
//     separatorWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
//     fontScaleFactor,
//   },
//   Thumbnail: {
//     sm: 24,
//     md: 32,
//     lg: 40,
//   },
//   SafeArea: {
//     top: isSafeAreaNeeded ? safeAreaTop : 0,
//     bottom: isSafeAreaNeeded ? safeAreaBottom : 0,
//     bottomLandscape: isSafeAreaNeeded ? safeAreaBottomLandscape : 0,
//     isSafeAreaNeeded,
//   },
//   Button: {
//     height: {
//       sm: 20,
//       md: 35,
//       lg: 50,
//       xl: 70,
//     },
//   },
//   Touchable: {
//     opacity: {
//       default: 0.6,
//       pressed: 0.4,
//     },
//   },
//   Dropdown: {
//     height: 50,
//   },
//   PinPad: {
//     pinPadWidth: deviceWidth > deviceHeight ? '$var.global.deviceHeight' : '$var.global.deviceWidth',
//     buttonDiameter: '$var.PinPad.pinPadWidth / 5', // 75,
//     buttonMargin: '$var.PinPad.pinPadWidth / 15', // 25,
//     dotDiameter: 6,
//   },
//   AppHeader: {
//     minHeight: 48,
//     maxHeight: 60,
//   },
//   FooterTabs: {
//     height: 50,
//     margin: themeSpaces.sm * 2,
//     marginBottom: isIphoneXGeneration() ? 0 : 0,
//     areaHeight: 0, // '$var.Footer.height + $var.Footer.marginBottom',
//     withSafeAreaHeight: 0, // '$var.Footer.areaHeight + $var.SafeArea.bottom',
//     iconSize: 18,
//     imageWidth: 44,
//     imageHeight: 44,
//     paddingHorizontal: isIphone5Generation() ? 0 : themeSpaces.xs,
//   },
//   HeaderTabs: {
//     height: 44,
//     underlineHeight: 2,
//   },
//   HeaderButtonTabs: {
//     height: 30,
//   },
//   Swiper: {
//     indicator: { height: 2, width: 48 },
//     bar: { height: 30 },
//   },
//   InputText: {
//     padding: themeSpaces.lg_md,
//     doublePadding: themeSpaces.lg * 2,
//   },
//   DoneBar: {
//     height: Platform.OS === 'ios' ? 40 : 0,
//   },
//   Content: {
//     bottomOffsetBase: '$var.DoneBar.height + $var.InputText.padding',
//     bottomOffset: '$var.Content.bottomOffsetBase + 10',
//   },
//   CheckableItem: {
//     height: 50,
//     iconContainerWidth: 40,
//   },
//   BannersList: {
//     bannerHeight: 120,
//     portfolioTextPadding: 100,
//   },
//   List: {
//     rowItemMinHeight: '$var.Button.height.lg',
//   },
//   PortfelStrategy: {
//     headerHeight: 268,
//   },
//   FooterFilter: {
//     width: deviceWidth > 768 ? '70%' : '63%',
//   },
//   Decoration: {
//     hairline: {
//       height: 1,
//     },
//   },
//   Radius: {
//     corner1: Platform.select({ ios: 8, android: 4 }),
//     corner3: Platform.select({ ios: 16, android: 8 }),
//     corner4: Platform.select({ ios: 12, android: 4 }),
//     corner5: Platform.select({ ios: 20, android: 8 }),
//     corner6: Platform.select({ ios: 16, android: 4 }),
//     corner7: Platform.select({ ios: 16, android: 16 }),
//   },
// };
//
// export const varsSource: ThemeVariables = {
//   $var: themeVars,
// };

import { LayoutAnimation, LayoutAnimationConfig, Platform } from 'react-native';

const keyboardDuration = 250;
const expandCollapseDuration = 150;
const inputFieldDuration = 100;
const navBarDuration = 150;

const layoutAnimationTypesKeyboard = Platform.OS === 'ios' ? LayoutAnimation.Types.keyboard : undefined;

const keyboard = Platform.OS !== 'ios' ? undefined : {
  duration: keyboardDuration,
  create: {
    ...LayoutAnimation.Presets.easeInEaseOut.create,
    type: layoutAnimationTypesKeyboard,
  },
  update: {
    ...LayoutAnimation.Presets.easeInEaseOut.update,
    type: layoutAnimationTypesKeyboard,
  },
  delete: {
    ...LayoutAnimation.Presets.easeInEaseOut.delete,
    type: layoutAnimationTypesKeyboard,
  },
};

export const VAnimationConfig = {
  actionSheetDuration: 300,
  actionSheetCloseDelay: 300 + 40,
  keyboardDuration,
  expandCollapseDuration,
  navBarDuration,
  inputFieldDuration,
  layoutAnimation: {
    keyboard,
    expandCollapse: { ...LayoutAnimation.Presets.easeInEaseOut, duration: expandCollapseDuration } as LayoutAnimationConfig,
    inputField: { ...LayoutAnimation.Presets.easeInEaseOut, duration: inputFieldDuration } as LayoutAnimationConfig,
    dialogTransform: { ...LayoutAnimation.Presets.easeInEaseOut, duration: expandCollapseDuration } as LayoutAnimationConfig,
    navBarTransform: { ...LayoutAnimation.Presets.easeInEaseOut, duration: navBarDuration } as LayoutAnimationConfig,
  },
};

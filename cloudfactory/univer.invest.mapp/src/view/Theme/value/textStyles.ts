import { IVThemeFontItem } from '@invest.wl/view/src/Theme/V.Theme.types';

export const textStyles: { [T: string]: IVThemeFontItem } = {
  title2: {
    fontFamily: 'SFProText-Bold',
    fontSize: 26,
    lineHeight: 36,
    letterSpacing: -0.41,
  },
  title3: {
    fontFamily: 'SFProText-Medium',
    fontSize: 20,
    lineHeight: 23,
    letterSpacing: -0.41,
  },
  title4: {
    fontFamily: 'SFProText-Regular',
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.41,
  },
  title5: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 18,
    lineHeight: 21,
    letterSpacing: -0.41,
  },
  title6: {
    fontFamily: 'SFProText-Regular',
    fontSize: 26,
    lineHeight: 36,
    letterSpacing: -0.41,
  },
  body1: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 18,
    lineHeight: 21,
    letterSpacing: -0.41,
  },
  body2: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: -0.41,
  },
  body3: {
    fontFamily: 'SFProText-Regular',
    fontSize: 17,
    lineHeight: 20,
    letterSpacing: -0.41,
  },
  body4: {
    fontFamily: 'SFProText-Semibold',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.41,
  },
  body5: {
    fontFamily: 'SFProText-Medium',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.41,
  },
  body6: {
    fontFamily: 'SFProText-Regular',
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: -0.41,
  },
  body7: {
    fontFamily: 'SFProText-Regular',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.24,
  },
  body8: {
    fontFamily: 'SFProText-Medium',
    fontSize: 15,
    lineHeight: 18,
    letterSpacing: -0.24,
  },
  body9: {
    fontFamily: 'SFProText-Regular',
    fontSize: 15,
    lineHeight: 18,
    letterSpacing: -0.24,
  },
  body9link: {
    fontFamily: 'SFProText-Medium',
    fontSize: 15,
    lineHeight: 19,
    letterSpacing: -0.41,
    textDecorationLine: 'underline',
  },
  body10: {
    fontFamily: 'SFProText-Regular',
    fontSize: 15,
    lineHeight: 15,
    letterSpacing: -0.24,
  },
  body11: {
    fontFamily: 'SFProText-Bold',
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: -0.41,
  },
  body12: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: -0.41,
  },
  body13: {
    fontFamily: 'SFProText-Medium',
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: -0.32,
  },
  body14: {
    fontFamily: 'SFProText-Regular',
    fontSize: 14,
    lineHeight: 16.4,
    letterSpacing: -0.41,
  },
  body15: {
    fontFamily: 'SFProText-Bold',
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.41,
  },
  body16: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.41,
  },
  body17: {
    fontFamily: 'SFProText-Regular',
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: -0.41,
  },
  body18: {
    fontFamily: 'SFProText-Medium',
    fontSize: 12,
    lineHeight: 20,
    letterSpacing: -0.41,
  },
  body19: {
    fontFamily: 'SFProText-Medium',
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: -0.41,
  },
  body20: {
    fontFamily: 'SFProText-Regular',
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: -0.41,
  },
  body21: {
    fontFamily: 'SFProText-Semibold',
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: -0.41,
  },
  body22: {
    fontFamily: 'SFProText-Regular',
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: -0.08,
  },
  caption2: {
    fontFamily: 'SFProText-Regular',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: -0.41,
  },
};

export type TVThemeFontName = keyof typeof textStyles;

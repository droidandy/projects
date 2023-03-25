// interface declaration merging to add custom mixins
import { createMuiTheme } from '@material-ui/core/styles';
import createMixins from '@material-ui/core/styles/createMixins';
import { breakpoints } from './breakpoints';
import { spacing } from './spacing';

declare module '@material-ui/core/styles/createMixins' {
  interface Mixins {
    toolbarHeight: string;
    toolbarHeightXS: string;
  }
}

const { breakpoints: breakpointsMixin, spacing: spacingMixin } = createMuiTheme({ breakpoints, spacing });

export const mixins = createMixins(breakpointsMixin, spacingMixin, {
  toolbarHeight: '5rem',
  toolbarHeightXS: '4.375rem',
});

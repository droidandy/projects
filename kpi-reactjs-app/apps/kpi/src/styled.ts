import * as styledComponents from 'styled-components';
import { ThemeVars } from './types-next';

const {
  default: styled,
  css,
  keyframes,
} = styledComponents as styledComponents.ThemedStyledComponentsModule<
  ThemeVars
>;

export { css, keyframes, styled };

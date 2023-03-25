import { css } from 'styled-components';

export const rtlMargin = (left: any, right: any) => css`
  margin-left: ${left};
  margin-right: ${right};

  .rtl & {
    margin-right: ${left};
    margin-left: ${right};
  }
`;

export const rtlPadding = (left: any, right: any) => css`
  padding-left: ${left};
  padding-right: ${right};

  .rtl & {
    padding-right: ${left};
    padding-left: ${right};
  }
`;

export const rtlTextLeft = () => css`
  text-align: left;
  .rtl & {
    text-align: right;
  }
`;

export const rtlTextRight = () => css`
  text-align: right;
  .rtl & {
    text-align: left;
  }
`;

export const rtlLeft = (value: any) => css`
  left: ${value};
  .rtl & {
    left: auto;
    right: ${value};
  }
`;

export const rtlRight = (value: any) => css`
  right: ${value};
  .rtl & {
    right: auto;
    left: ${value};
  }
`;

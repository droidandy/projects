import { Overrides } from '@material-ui/core/styles/overrides';
import { PaletteOptions, SimplePaletteColorOptions } from '@material-ui/core/styles/createPalette';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import { breakpoints } from './breakpoints';
import { mixins } from './mixins';

const { down, up } = createBreakpoints(breakpoints);

type OverridesWithPalette = (palette: PaletteOptions) => Overrides;

const overrides: OverridesWithPalette = (
  options: PaletteOptions,
): Overrides & {
  MuiPaginationItem: Record<'root' | 'page' | 'ellipsis', unknown>;
  MuiRating: Record<'root', unknown>;
} => {
  const { background, text, grey, common } = options;
  const primary = options.primary as SimplePaletteColorOptions;
  const secondary = options.secondary as SimplePaletteColorOptions;

  return {
    MuiCssBaseline: {
      '@global': {
        html: {
          WebkitFontSmoothing: 'auto',
        },
        body: {
          fontFamily: 'Open Sans, sans-serif',
          fontSize: '1rem',
          lineHeight: '1.5rem',
          letterSpacing: 'normal',
        },
      },
    },
    MuiAppBar: {
      colorDefault: {
        backgroundColor: background?.paper,
      },
    },
    MuiButton: {
      root: {
        paddingTop: '.5rem',
        paddingBottom: '.5rem',
        fontSize: '1em',
        lineHeight: '1.5em',
        fontWeight: 'inherit',
        textDecoration: 'inherit',
        textTransform: 'inherit',
        fontStyle: 'normal',
        textAlign: 'center',
        boxShadow: 'none',
        borderRadius: '.5rem',
        '&:hover': {
          boxShadow: 'none',
        },
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
      outlined: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
      textPrimary: {
        '&:hover': {
          boxShadow: 'none',
          backgroundColor: 'transparent',
        },
      },
      outlinedPrimary: {
        border: `2px solid ${primary?.main}`,
        '&:hover': {
          boxShadow: 'none',
          border: `2px solid ${primary?.main}`,
        },
      },
      sizeSmall: {
        fontSize: '1em',
        lineHeight: '1.5em',
        paddingTop: '.435rem',
        paddingBottom: '.435rem',
        borderRadius: '.375rem',
      },
      sizeLarge: {
        fontSize: '1em',
        lineHeight: '1.5em',
        paddingTop: '1rem',
        paddingBottom: '1.25rem',
        [down('xs')]: {
          paddingTop: '.75rem',
          paddingBottom: '.875rem',
        },
      },
      startIcon: {
        marginLeft: '-0.3125rem',
        marginRight: '0.625rem',
      },
      iconSizeSmall: {
        '& > *:first-child': {
          fontSize: '1rem',
        },
      },
      iconSizeMedium: {
        '& > *:first-child': {
          fontSize: '1.5rem',
        },
      },
      iconSizeLarge: {
        '& > *:first-child': {
          fontSize: '2rem',
        },
      },
    },
    MuiToolbar: {
      regular: {
        minHeight: mixins.toolbarHeight,
        [up('sm')]: {
          minHeight: mixins.toolbarHeight,
        },
        [down('xs')]: {
          minHeight: mixins.toolbarHeightXS,
        },
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: '0.5rem',
      },
      elevation1: {
        boxShadow: '0 0.5rem 3rem 0 rgba(0, 0, 0, 0.1)',
      },
    },
    MuiTabs: {
      root: {
        color: text?.secondary,
        alignItems: 'center',
        border: 'none',
        '& .Mui-disabled': {
          color: grey && grey['500'],
        },
        '& span.MuiTab-wrapper': {
          fontWeight: 'normal',
          height: '2.75rem',
        },
        '& .Mui-selected span.MuiTab-wrapper': {
          fontWeight: 'bold',
          color: text?.secondary,
          opacity: 1,
        },
      },
      indicator: {
        backgroundColor: primary?.main,
        opacity: 1,
        height: '.375rem',
        [down('xs')]: {
          height: '.25rem',
        },
      },
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        fontSize: '1rem',
        fontWeight: 400,
        minWidth: 'auto',
        minHeight: 'auto',
        maxWidth: 'initial',
        padding: '0 1.25rem',
        lineHeight: '1.5rem',
        color: secondary?.main,
        opacity: 1,
        [down('xs')]: {
          padding: '0 .625rem',
        },
        '&:not(:last-of-type)': {
          marginRight: '3.75rem',
          [down('xs')]: {
            marginRight: '.125rem',
          },
        },
      },
    },
    MuiCheckbox: {
      root: {
        padding: '0',
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: 'transparent',
        },
        height: '1.25rem',
        width: '1.25rem',
        borderRadius: '0.25rem',
        '& input:hover ~ *, & input:focus + *': {
          opacity: '0.5',
        },
      },
      colorSecondary: {
        backgroundColor: 'transparent',
        color: '#131233',
        '&$checked': {
          color: '#131233',
          '&:hover': {
            backgroundColor: 'transparent',
          },
        },
      },
      colorPrimary: {
        backgroundColor: 'transparent',
        color: '#990031',
        '&$checked': {
          color: '#990031',
          '&:hover': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiRadio: {
      root: {
        padding: '0',
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: 'transparent',
        },
        height: '1.25rem',
        width: '1.25rem',
        borderRadius: '0.25rem',
        '& input:hover ~ *, & input:focus + *': {
          opacity: '0.5',
        },
      },
      colorSecondary: {
        backgroundColor: 'transparent',
        color: '#131233',
        '&$checked': {
          color: '#131233',
          '&:hover': {
            backgroundColor: 'transparent',
          },
        },
      },
      colorPrimary: {
        color: '#990031',
        backgroundColor: 'transparent',
        '&$checked': {
          color: '#990031',
          '&:hover': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiDivider: {
      root: {},
      light: {
        backgroundColor: background?.paper,
        opacity: 0.3,
      },
    },
    MuiSwitch: {
      root: {
        height: '1.25rem',
        width: '1.875rem',
        padding: 0,
        margin: 0,
        position: 'relative',
      },
      switchBase: {
        padding: 0,
        left: 0,
        '&:hover': {
          backgroundColor: 'transparent',
        },
        '&$checked': {
          transform: 'translateX(.625rem)',
        },
        '&$checked + $track': {
          opacity: 1,
        },
      },
      input: { width: '100%' },
      track: {
        backgroundColor: grey && grey[500],
        opacity: 1,
        borderRadius: '.25rem',
        '$checked + &': {
          opacity: 1,
        },
      },
      thumb: {
        margin: '.125rem',
        color: common?.white,
        boxShadow: 'none',
        borderRadius: '.125rem',
        height: '1rem',
        width: '1rem',
      },
      colorSecondary: {
        '&$checked + $track': {
          backgroundColor: common?.black,
        },
      },
    },
    MuiChip: {
      root: {
        backgroundColor: 'transparent',
        border: `.0625rem solid ${common?.black}`,
        borderRadius: '.25rem',
        height: '1.25rem',
        width: 'auto',
        paddingLeft: '.625rem',
        paddingRight: '.625rem',
        '&$disabled': {
          backgroundColor: grey?.['200'],
          color: grey?.['500'],
          border: '.0625rem solid transparent',
          opacity: 1,
        },
      },
      label: {
        fontWeight: 'normal',
        textTransform: 'uppercase',
        lineHeight: '1.25rem',
        fontSize: '.625rem',
      },
    },
    MuiSlider: {
      rail: {
        height: '0.25rem',
        borderRadius: '0.125rem',
        backgroundColor: grey && grey[200],
        opacity: 1,
      },
      track: {
        height: '0.25rem',
        borderRadius: '0.125rem',
        backgroundColor: primary?.main,
      },
      thumb: {
        width: '1rem',
        height: '1rem',
        backgroundColor: primary?.main,
        border: `0.25rem solid ${common?.white}`,
        marginTop: '-0.7rem',
        marginLeft: '-0.75rem',
        boxShadow: '0 0.125rem 0.5rem rgba(0, 0, 0, 0.2)',
        boxSizing: 'content-box',
      },
      markLabel: {
        color: grey && grey[500],
        fontSize: '1rem',
        letterSpacing: 'normal',
        lineHeight: 1.5,
        transform: 'none',
        fontWeight: 600,
        '&[data-index="1"]': {
          left: 'initial !important',
          right: 0,
        },
        [down('xs')]: {
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
        },
      },
      markLabelActive: {
        color: grey && grey[500],
      },
      mark: {
        display: 'none',
      },
      markActive: {
        display: 'none',
      },
    },
    MuiAccordion: {
      root: {
        backgroundColor: background?.paper,
        fontSize: '1rem',
        boxShadow: 'none',
        '&:before': {
          display: 'none', // eliminates built-in border
        },
        borderTop: `1px solid ${secondary.light}`,
        '&:last-child': {
          borderBottom: `1px solid ${secondary.light}`,
        },
        '&$expanded': {
          margin: 0,
          paddingBottom: 0,
        },
      },
    },
    MuiAccordionSummary: {
      root: {
        maxHeight: '64px', // fix
        backgroundColor: background?.paper,
        padding: '1rem 0',
      },
      expandIcon: {
        padding: 0,
        color: common?.black,
        margin: '.25rem 1px 0 .625rem',
      },
    },
    MuiAccordionDetails: {
      root: {
        backgroundColor: background?.paper,
        padding: '0 1rem 0 1.5rem',
        boxShadow: 'none',
        borderRadius: 0,
        [down('xs')]: {
          paddingLeft: '.75rem',
        },
      },
    },
    MuiBreadcrumbs: {
      root: {
        [down('xs')]: {
          overflow: 'hidden',
        },
      },
      ol: {
        [down('xs')]: {
          display: 'flex',
          overflowX: 'auto',
          flexWrap: 'nowrap',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      },
      li: {
        [down('xs')]: {
          flexShrink: 0,
        },
      },
    },
    MuiPaginationItem: {
      root: {
        width: '2.5rem',
        height: '2.5rem',
        margin: '0 0.625rem',
        background: text!.secondary,
        border: `0.0625rem solid ${text!.primary}`,
        borderRadius: '0.25rem',
      },
      page: {
        '&.Mui-selected': {
          color: text!.secondary,
          backgroundColor: primary!.main,
        },
      },
      ellipsis: {
        width: '2.5rem',
        height: '2.5rem',
        paddingTop: '0.313rem',
      },
    },
    // controls
    MuiFormControl: {
      root: {
        top: 0,
        width: '100%',
        position: 'relative',
      },
    },
    MuiInput: {
      formControl: {
        'label + &': {
          marginTop: 0,
        },
      },
      underline: {
        '&:before': {
          borderBottom: `1px solid ${grey && grey[200]}`,
        },
        '&:after': {
          borderBottom: `1px solid ${grey && grey[200]}`,
        },
      },
    },
    MuiInputLabel: {
      formControl: {
        transform: 'translate(0, 1rem) scale(1)',
      },
      shrink: {
        transform: 'translate(0, 0.5rem) scale(0.75)',
        color: text?.hint,
        lineHeight: 1,
      },
      outlined: {
        top: '50%',
        left: '1.25rem',
        transitionProperty: 'top',
        transform: 'translateY(-50%)',
        '&$shrink': {
          top: '30%',
          left: '1.25rem',
          transform: 'scale(0.75) translateY(-50%)',
        },
      },
    },
    MuiFormLabel: {
      root: {
        color: text?.primary,
        lineHeight: 1.5,
        '&.Mui-focused': {
          color: 'inherit',
        },
      },
    },
    MuiInputBase: {
      root: {
        '& .MuiSelect-icon:not(.MuiSelect-iconOutlined)': {
          top: '50%',
          right: '1rem',
        },
      },
      formControl: {
        '.MuiInputLabel-shrink + &': {
          '& > .MuiInputBase-input': {
            padding: '1.25rem 0 1rem',
          },
        },
      },
      input: {
        lineHeight: 1.5,
        height: '1.5rem',
        padding: '1.5rem 0 0.75rem',
      },
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: '0.5rem',
        backgroundColor: background?.paper,
        height: '100%',
        '.MuiInputLabel-shrink + &': {
          '& > .MuiInputBase-input': {
            padding: '1.5rem 1.25rem 0.75rem',
          },
        },
        '& .MuiSelect-iconOutlined': {
          marginTop: '6px',
        },
        [down('xs')]: {
          '& .MuiSelect-iconOutlined': {
            marginTop: '2px',
          },
        },
      },
      notchedOutline: {
        border: 0,
        visibility: 'hidden',
      },
      input: {
        padding: '1.5rem 0 0.75rem',
      },
      adornedStart: {
        paddingLeft: '1.25rem',
      },
      adornedEnd: {
        paddingRight: '1rem',
      },
    },
    MuiSelect: {
      iconOutlined: {
        right: '1rem',
        transition: '0.25s ease-out',
      },
      select: {
        '&:focus': {
          borderRadius: 'inherit',
          backgroundColor: 'transparent',
        },
      },
    },
    MuiFormHelperText: {
      root: {
        position: 'absolute',
        bottom: '0.1875rem',
        marginTop: 0,
      },
      contained: {
        bottom: '0.0625rem',
        marginLeft: '1.25rem',
        marginRight: '1.25rem',
      },
    },
    MuiFormControlLabel: {
      root: {
        marginLeft: 0,
        marginRight: 0,
      },
      label: {
        marginLeft: '0.625rem',
        [down('xs')]: {
          fontSize: '0.875rem',
        },
      },
      labelPlacementStart: {
        marginLeft: 0,
        marginRight: 0,
        '& $label': {
          marginRight: '0.625rem',
        },
      },
    },
    MuiRating: {
      root: {
        color: primary?.main,
      },
    },
  };
};
export { overrides };

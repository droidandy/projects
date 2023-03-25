import { TypographyOptions } from '@material-ui/core/styles/createTypography';

const typography: TypographyOptions = {
  fontFamily: ['Open Sans', 'sans-serif', 'Helvetica Neue'].join(','),
  h1: {
    fontSize: '3.85rem',
    lineHeight: '6rem',
    fontWeight: 'bold',
  },
  h2: {
    fontSize: '2rem',
    lineHeight: '3rem',
    fontWeight: 'bold',
  },
  h3: {
    fontSize: '1.5rem',
    lineHeight: '2.25rem',
    fontWeight: 'bold',
  },
  h4: {
    fontSize: '1.25rem',
    lineHeight: '1.625rem',
    fontWeight: 'bold',
  },
  h5: {
    fontSize: '1rem',
    lineHeight: '1.5rem',
    fontWeight: 'bold',
  },
  h6: {
    fontSize: '0.875rem',
    lineHeight: '1.315rem',
    fontWeight: 'bold',
  },
  subtitle1: {
    fontSize: '1rem',
    lineHeight: '1.5rem',
    fontWeight: 600,
  },
  subtitle2: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    fontWeight: 600,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: '1.5rem',
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: '1rem',
  },
  overline: {
    fontSize: '0.625rem',
    lineHeight: '0.75rem',
    textTransform: 'uppercase',
    fontWeight: 700,
  },
};

export { typography };

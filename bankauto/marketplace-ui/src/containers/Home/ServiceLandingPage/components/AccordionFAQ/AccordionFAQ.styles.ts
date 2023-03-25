import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { text }, typography, breakpoints: { down } }) => ({
    container: {
      display: 'block',
      padding: '2.5rem 22rem',
      [down('xs')]: {
        padding: ' 1.25rem 0.625rem  1.25rem 0.625rem',
      },
    },
    header: {
      ...typography.h2,
      marginBottom: '3.75rem',
      color: text.primary,
      textAlign: 'center',
      [down('xs')]: {
        ...typography.h4,
        marginBottom: '1.5rem',
      },
    },
  }),
  { name: 'AccordionFAQ' },
);

export { useStyles };

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette: { primary }, breakpoints: { down } }) => ({
    modalRoot: {
      maxWidth: '32.5rem',
      borderRadius: '.5rem',
    },
    modalLink: {
      textDecoration: 'underline',
      color: primary.main,
    },
    renisLogo: {
      maxWidth: '15.625rem',
      width: '100%',
      height: '1.875rem',
    },
    content: {
      padding: '1.875rem 2.5rem 2.5rem',
      [down('xs')]: {
        padding: '1.25rem',
      },
    },
    insuranceInfo: {
      maxHeight: '70vh',
      overflowY: 'scroll',
    },
    osagoList: {
      listStyle: 'initial',
      paddingLeft: '1.5rem',
    },
  }),
  { name: 'InsuranceModal' },
);

export { useStyles };

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({
    palette: {
      common: { white },
      secondary: { light },
    },
  }) => ({
    root: {},
    buttonWrapper: {
      borderRadius: '0.5rem',
      height: '100%',
      '&.bgColorWhite': {
        backgroundColor: white,
      },
      '& button': {
        height: '100%',
      },
    },
    mainDescriptionWrapper: {
      minHeight: '6.375rem',
      paddingTop: '0.625rem',
    },
    dividerWrapper: {
      paddingTop: '1.25rem',
      paddingBottom: '1.875rem',
    },
    formWrapper: {
      backgroundColor: light,
      borderRadius: '0.5rem',
    },
    firstBlock: {
      padding: '2.5rem',
      width: '100%',
    },
    block: {
      padding: '1.875rem 2.5rem 2.5rem',
      width: '100%',
    },
    blockInner: {
      paddingTop: '2.5rem',
    },
    dividerWhite: {
      backgroundColor: white,
    },
    titleWrapper: {
      display: 'flex',
      paddingBottom: '1.875rem',
      alignItems: 'center',
    },
    tooltipTextColor: {
      color: white,
    },
    formFooter: {
      padding: '0 2.5rem 3.75rem',
    },
  }),
  { name: 'Contract' },
);

export { useStyles };

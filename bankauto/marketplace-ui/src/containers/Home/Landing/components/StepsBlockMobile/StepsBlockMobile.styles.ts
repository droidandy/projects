import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(
  ({ palette: { common, primary } }) => {
    return {
      root: {
        width: '100%',
        boxShadow: '0rem 0.5rem 3rem rgba(0, 0, 0, 0.1)',
        borderRadius: '0.5rem',
        backgroundColor: common.white,
        position: 'relative',
        transform: 'translateY(-4rem)',
      },
      titleBlock: {
        padding: '1.125rem 5.4375rem 1.375rem 5.5rem',
        textAlign: 'center',
      },
      contentBlock: {
        padding: '1.25rem',
      },
      contentItem: {
        display: 'flex',
        width: '100%',
        paddingBottom: '2rem',
        '&:last-of-type': {
          paddingBottom: '0rem',
        },
      },
      itemNumber: {
        width: '2.5rem',
        height: '2.5rem',
        borderRadius: '0.25rem',
        backgroundColor: primary.main,
        textAlign: 'center',
        color: common.white,
        marginRight: '1.25rem',
      },
      contentText: {
        width: '80%',
      },
      buttonWrapper: {
        padding: '1.25rem',
        margin: '0 -1.25rem',
        background: common.white,
        position: 'fixed',
        bottom: 0,
        display: 'flex',
        width: '100%',
        zIndex: 15,
      },
      button: {
        padding: 0,
      },
    };
  },
  {
    name: 'StepsBlockMobile',
  },
);

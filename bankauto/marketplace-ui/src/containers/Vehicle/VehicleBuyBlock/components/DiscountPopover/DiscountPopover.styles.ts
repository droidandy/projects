import { makeStyles, Theme } from '@material-ui/core/styles';

type StyleProps = {
  isMobile: boolean;
};

const useStyles = makeStyles<Theme, StyleProps>(
  ({
    palette: {
      common: { black },
    },
  }) => ({
    root: {
      height: ({ isMobile }) => (isMobile ? '2.25rem' : '3rem'),
      display: 'flex',
    },
    arrow: {
      width: '1.25rem',
      height: '1.25rem',
      '& path': {
        stroke: black,
      },
    },
    arrowReversed: {
      transform: 'rotate(180deg)',
    },
    arrowButtonWrapper: {
      display: 'flex',
      alignItems: 'center',
    },
  }),
  { name: 'DiscountPopover' },
);

export { useStyles };

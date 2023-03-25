import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles<Theme>(
  ({ palette: { common } }) => ({
    root: {
      padding: 0,
      minWidth: '2.5rem',
      maxWidth: '2.5rem',
      minHeight: '2.5rem',
      maxHeight: '2.5rem',
      overflow: 'hidden',
      border: `1px solid ${common.black}`,
    },
    iconWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
    icon: {
      width: '0.4375rem',
      height: '0.75rem',
    },
  }),
  { name: 'SwiperNavButton' },
);

import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles<Theme, { active: boolean }>(
  ({ breakpoints: { down }, typography, palette: { common, grey } }) => ({
    container: {
      overflow: 'hidden',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: ({ active }) => (active ? grey[500] : common.white),
      border: `1px solid ${grey[500]}`,
      borderRadius: '0.5rem',
      width: '100%',
      padding: '1rem',
      height: '3.75rem',
      [down('xs')]: {
        padding: '0.938rem',
        height: '3.125rem',
      },
    },
    label: {
      textAlign: 'center',
      color: ({ active }) => (active ? common.white : common.black),
      ...typography.body1,
      [down('xs')]: {
        ...typography.body2,
      },
      fontWeight: ({ active }) => (active ? 600 : 'normal'),
    },
    icon: {
      display: 'inherit',
      marginLeft: '-0.3125rem',
      marginRight: '0.625rem',
    },
  }),
  { name: 'VehicleButton' },
);

export { useStyles };

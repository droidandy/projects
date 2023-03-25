import { makeStyles } from '@material-ui/core/styles';

export enum FaceType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

interface IStyle {
  face: FaceType;
}

export const useStyles = makeStyles(
  ({ palette: { primary, common, background }, breakpoints: { down } }) => ({
    container: ({ face }: IStyle) => ({
      position: 'relative',
      width: '100%',
      height: face === FaceType.PRIMARY ? '13.75rem' : '100%',
      backgroundColor: common.black,
      borderRadius: '0.5rem',
      '& div > div': {
        borderRadius: '0.5rem',
        overflow: 'hidden',
      },
      '& img': {
        opacity: 0.6,
      },
      [down('xs')]: {
        height: '14.25rem',
        '&:after': {
          display: 'none',
        },
      },
    }),
    content: {
      position: 'absolute',
      padding: '1.25rem',
      bottom: 0,
      left: 0,
      right: 0,
      fontWeight: 'bold',
      color: primary.contrastText,
      background: `linear-gradient(180deg, ${background.default} 0%, rgba(0, 0, 0, 0.7) 100%)`,
      borderRadius: '0 0 0.5rem 0.5rem',
    },
  }),
  { name: 'ServiceItem' },
);

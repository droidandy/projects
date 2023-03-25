import { makeStyles } from '@material-ui/core/styles';

interface StyleProps {
  animationDuration: number;
}

export const useStyles = ({ animationDuration }: StyleProps) =>
  makeStyles(
    () => ({
      partnersBlock: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2.5rem 0',
        overflow: 'hidden',
      },
      sliders: {
        position: 'relative',
        height: '8.25rem',
        width: '100%',
      },
      imagesBlock: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignSelf: 'flex-start',
        alignItems: 'center',
        marginBottom: '.5rem',
        position: 'absolute',
        top: 0,
        left: 0,
        animation: `${animationDuration}ms infinite linear`,
      },
      imagesBlockFirst: {
        animationName: '$animationFirst',
      },
      imagesBlockSecond: {
        animationName: '$animationSecond',
      },
      imagesBlockItem: {
        width: '12.5rem',
        display: 'block',
        margin: '0 1.5rem 2rem 1.5rem',
        position: 'relative',
        height: '6.25rem',
      },
      '@keyframes animationFirst': {
        '0%': {
          transform: 'translateX(0)',
        },
        '100%': {
          transform: 'translateX(-100%)',
        },
      },
      '@keyframes animationSecond': {
        '0%': {
          transform: 'translateX(100%)',
        },
        '100%': {
          transform: 'translateX(0)',
        },
      },
    }),
    { name: 'PartnersSection' },
  );

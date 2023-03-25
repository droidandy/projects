import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles<Theme>(
  ({
    palette: {
      text: { primary },
      grey,
    },
    breakpoints: { up, down },
  }) => ({
    root: {
      position: 'relative',
      [down('xs')]: { borderRadius: '.5rem' },
    },
    carouselContainer: {
      position: 'relative',
      padding: '1px',
      [down('xs')]: { overflow: 'visible' },
    },
    carouselItem: {
      position: 'relative',
    },
    navButton: {
      display: 'none',
      [up('sm')]: {
        display: 'block',
      },
      border: `1px solid ${primary}`,
      padding: 0,
      minWidth: '2.5rem',
      maxWidth: '2.5rem',
      minHeight: '2.5rem',
      maxHeight: '2.5rem',
      boxSizing: 'border-box',
      overflow: 'hidden',
      position: 'absolute',
      cursor: 'pointer',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1,
      '&:hover': {
        border: `1px solid ${grey[500]}`,
        '& span::before': {
          borderColor: grey[600],
        },
      },
    },
    buttonNext: {
      right: '-3.5rem',
    },
    buttonPrev: {
      left: '-3.5rem',
    },
    shevron: {
      position: 'relative',
      '&::before': {
        position: 'absolute',
        display: 'inline-block',
        height: '0.5rem',
        width: '0.5rem',
        borderStyle: 'solid',
        borderColor: primary,
        borderWidth: '0.135rem 0.135rem 0 0',
        content: '""',
        top: '50%',
        left: '50%',
        transform: 'translate(-75%,-50%) rotate(45deg)',
        transition: 'all 0.25s',
      },
      '&.left': {
        '&::before': {
          transform: 'translate(-25%,-50%) rotate(-135deg)',
        },
      },
    },
  }),
  { name: 'VehicleSliders' },
);

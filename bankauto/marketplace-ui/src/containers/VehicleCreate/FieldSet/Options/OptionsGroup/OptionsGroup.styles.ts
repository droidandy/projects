import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  ({ palette, breakpoints: { down } }) => ({
    root: {
      padding: '1.25rem 0',
      borderBottom: '1px solid white',
      '&:last-of-type': {
        borderBottom: 'none',
      },
    },
    title: {},
    container: {
      padding: '1.25rem 0',
    },
    item: {},
    select: {
      [down('xs')]: {
        borderBottom: `1px solid ${palette.secondary.light}`,
        '& label': {
          left: 0,
          paddingBottom: '.375rem',
        },
        '& > .MuiInputLabel-shrink': {
          left: 0,
          '& + .MuiOutlinedInput-root > .MuiInputBase-input': {
            paddingLeft: 0,
          },
        },
        '& > div': {
          paddingRight: 0,
          paddingLeft: 0,
        },
        '& .MuiSelect-iconOutlined': {
          right: 0,
        },
      },
    },
  }),
  { name: 'OptionsGroup' },
);

export { useStyles };

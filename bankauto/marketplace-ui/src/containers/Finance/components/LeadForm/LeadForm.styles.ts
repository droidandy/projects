import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette: { primary }, breakpoints: { down } }) => ({
  name: {
    gridArea: 'name',
    borderRadius: '0.5rem',
    height: '3.75rem',
  },

  phone: {
    gridArea: 'phone',
    borderRadius: '0.5rem',
    height: '3.75rem',
  },

  submitButton: {
    width: '100%',
    gridArea: 'submitButton',
    height: '3.75rem',

    '&:not(:disabled) .MuiButton-label': {
      color: primary.contrastText,
    },
    [down('xs')]: {
      fontSize: '1rem',
    },
  },

  checkboxWrapper: {
    gridArea: 'checkbox',
    position: 'relative',

    justifySelf: 'center',
  },

  checkbox: {
    '& .MuiCheckbox-root input:hover ~ *, .MuiCheckbox-root input:focus + *': {
      opacity: 1,
    },
    [down('xs')]: {
      marginTop: '0.625rem',
    },
  },

  checkboxError: {
    bottom: '-1rem',
    left: '1.875rem',
  },

  root: {
    display: 'grid',
    alignItems: 'center',
    columnGap: '1.875rem',
    rowGap: '2.5rem',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateAreas: `
    "name      phone    submitButton"
    "checkbox  checkbox checkbox"
    `,
    [down('xs')]: {
      rowGap: '0.625rem',
      gridTemplateColumns: '1fr',
      gridTemplateAreas: `
         "name         "
         "phone        "
         "submitButton "
         "checkbox     "
         `,
    },
  },
}));

export { useStyles };

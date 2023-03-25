import { MutableState, InternalFieldState } from 'final-form';

export const setFieldTouched = (args: any[], state: MutableState<any>) => {
  if (state?.fields) {
    Object.values(state.fields).forEach((field: InternalFieldState<any>) => {
      // eslint-disable-next-line no-param-reassign
      if (args && args.length) {
        const [fieldsToTouch] = args;

        if (fieldsToTouch.includes(field.name)) {
          field.touched = true;
        }
      } else {
        field.touched = true;
      }
    });
  }
};

import { MutableState } from 'final-form';
import { isEqual } from 'lodash';

export const setFieldDataOptions = <T extends { [key: string]: any }, K extends keyof T>(
  args: [K, any],
  state: MutableState<T>,
) => {
  const [name, options] = args;
  const field = state.fields[name as string];
  if (field && !isEqual(field.data.options, options)) {
    field.data = { ...field.data, options };
  }
};

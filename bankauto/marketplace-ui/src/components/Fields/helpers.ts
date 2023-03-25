import { useField } from 'react-final-form';

export const useFieldValue = (name: string) => {
  const {
    input: { value },
  } = useField(name, { subscription: { value: true } });
  return value;
};

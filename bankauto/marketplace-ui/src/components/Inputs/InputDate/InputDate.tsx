import React, { FC } from 'react';
import * as Yup from 'yup';
import Input, { Props as InputProps } from '@marketplace/ui-kit/components/Input';
import { isValid } from 'helpers/validations/date';

export interface InputDateProps extends InputProps {}

export const dateValidation = () =>
  Yup.string()
    .min(10, 'Некорректно заполнено поле')
    .length(10, 'Некорректно заполнено поле')
    .test('isValid', 'Должно быть валидной датой', isValid)
    .matches(/^[0-9\\.]*$/, 'Некорректно заполнено поле');

const InputDate: FC<InputDateProps> = (props) => {
  return <Input {...props} mask="##.##.####" useFormattedValue />;
};

export default InputDate;

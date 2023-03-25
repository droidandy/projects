import React, { FC } from 'react';
import * as Yup from 'yup';
import Input, { Props as InputProps } from '@marketplace/ui-kit/components/Input';
import { PHONE_INPUT_FORMAT } from 'constants/inputFormats';

export interface InputPhoneProps extends InputProps {}

export const phoneValidation = () => Yup.string().length(10, 'Некорректный телефон');

const InputPhone: FC<InputPhoneProps> = (props) => {
  return <Input {...props} mask={PHONE_INPUT_FORMAT} />;
};

export default InputPhone;

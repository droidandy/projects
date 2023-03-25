import React, { FC } from 'react';
import * as Yup from 'yup';
import Input, { Props as InputProps } from '@marketplace/ui-kit/components/Input';

export interface InputEmailProps extends InputProps {}

export const emailValidation = () => Yup.string().email();

const InputEmail: FC<InputEmailProps> = (props) => {
  return <Input {...props} />;
};

export default InputEmail;

import * as Yup from 'yup';
import { EmailValidator, PasswordValidator } from './validators';

export const EmailLoginSchema = Yup.object().shape({
	email: EmailValidator,
	password: PasswordValidator
});

import * as Yup from 'yup';
import {
	EmailValidator,
	FirstNameValidator,
	LastNameValidator,
	PasswordValidator
} from './validators';

export const RegisterFullNameSchema = Yup.object().shape({
	firstName: FirstNameValidator,
	lastName: LastNameValidator
});

export const RegisterEmailSchema = Yup.object().shape({
	email: EmailValidator
});

export const RegisterPasswordSchema = Yup.object().shape({
	password: PasswordValidator
});

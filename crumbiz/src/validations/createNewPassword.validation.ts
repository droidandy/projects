import * as Yup from 'yup';
import { PasswordValidator } from './validators';

export const CreatePasswordSchema = Yup.object().shape({
	password: PasswordValidator,
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password'), null], "Password don't match")
		.required('Password confirmation is required')
});

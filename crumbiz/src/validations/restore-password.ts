import { EmailValidator } from './validators';
import * as Yup from 'yup';

export const RestorePasswordSchema = Yup.object().shape({
	email: EmailValidator
});

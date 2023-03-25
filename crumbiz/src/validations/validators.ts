import * as Yup from 'yup';

export const PasswordValidator = Yup.string()
	.label('Password')
	.required('Password is required.')
	.matches(
		/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
		'Password must contain at least 8 characters, one uppercase letter, one number and one special character'
	);

export const FirstNameValidator = Yup.string()
	.label('First Name')
	.required('First Name is required.');

export const LastNameValidator = Yup.string()
	.label('Last Name')
	.required('Last Name is required.');

export const EmailValidator = Yup.string()
	.label('Email')
	.email('Email is invalid.')
	.required('Email is required.');

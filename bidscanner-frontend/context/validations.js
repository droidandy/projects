const presence = { message: 'Required' };

export const email = {
  presence,
  email: { message: 'Please enter a valid email' },
};

export const password = {
  presence,
  length: { minimum: 6, maximum: 25, message: 'The password should be from 6 to 25 characters long' },
};

export const confirmPassword = {
  equality: {
    attribute: 'password',
    message: 'Should be equal',
  },
};

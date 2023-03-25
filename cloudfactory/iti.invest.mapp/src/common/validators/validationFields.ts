// const isEmailValidation = (value?: string) => value ? isEmail(value) : false;
// const isStringNotEmpty = (value?: string) => !!value && value.length !== 0;
// const isLengthPassword = (value?: string) => !!value && isLength(value, { min: 6, max: 10 });
// const isLengthPasswordDemo = (value?: string) => !!value && isLength(value, { min: 8, max: 10 });
// const isLengthPasswordChange = (value?: string, minLength?: number, maxLength?: number) =>
//   !!value && isLength(value, { min: minLength ? minLength : 6, max: maxLength ? maxLength : 16 });
// const isNoSpecialCharacters = (value?: string) => !!value && numbersLatinLettersSimpleSymbols(value);
// const isHasUpperCaseCharacter = (value?: string) => !!value && value.split('').some(l => l.toLowerCase() !== l);
// const isHasLowerCaseCharacter = (value?: string) => !!value && value.split('').some(l => l.toUpperCase() !== l);
// const isHasNumber = (value?: string) => !!value && value.split('').some(l => !isNaN(parseInt(l, 10)));
// const isNumericOnly = (value?: string) => value ? isNumber(value) || isNumeric(value) : false;
// const isNumberNotZero = (value?: string) => value ? (isNumber(value) || isNumeric(value) && value !== '0') : false;

// const rules = {
//   required: new Rule(isStringNotEmpty).validWhen(r => r).formatter(r => 'Обязательно для заполнения'),
//   email: new Rule(isEmailValidation).validWhen(r => r).formatter(r => 'Неверное значение'),
//   lengthPassword: new Rule(isLengthPassword).validWhen(r => r).formatter(r => 'Длина пароля дожна быть не менее 6 и не более 10 символов'),
//   lengthPasswordChange: (minLength: number, maxLength: number) =>
//     new Rule((value) => isLengthPasswordChange(value, minLength, maxLength))
//       .validWhen(r => r).formatter(r => `Длина пароля дожна быть от ${minLength} до ${maxLength} символов`),
//   lengthPasswordDemo: new Rule(isLengthPasswordDemo).validWhen(r => r).formatter(r => 'Длина пароля дожна быть не менее 8 и не более 10 символов'),
//   noSpecialCharacters: new Rule(isNoSpecialCharacters).validWhen(r => r).formatter(r => 'Спецсимволы недопустимы'),
//   hasUpperCase: new Rule(isHasUpperCaseCharacter).validWhen(r => r).formatter(r => 'Используйте хотя бы один заглавный символ'),
//   hasLowerCase: new Rule(isHasLowerCaseCharacter).validWhen(r => r).formatter(r => 'Используйте хотя бы один строчный символ'),
//   hasNumber: new Rule(isHasNumber).validWhen(r => r).formatter(r => 'Используйте хотя бы одну цифру'),
//   latinOnly: new Rule(isNoSpecialCharacters).validWhen(r => r).formatter(r => 'Пароль долен содержать только латинские буквы'),
//   numberOnly: new Rule(isNumericOnly).validWhen(r => r).formatter(r => 'Неверное значение'),
//   numberNotZero: new Rule(isNumberNotZero).validWhen(r => r).formatter(r => 'Значение не должно быть равно 0'),
// };

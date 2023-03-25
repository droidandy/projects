import * as Yup from 'yup';
import { PROOF_CREDIT_SUM, EmploymentType } from 'constants/creditEmployment';

const EmploymentFieldsetSchema = (creditAmount: number, isAutoCredit = true) =>
  Yup.object().shape(
    {
      employmentType: Yup.string().nullable().required('Необходимо указать тип занятости'),
      employerName: Yup.object()
        .nullable()
        .when('employmentType', {
          is: (employmentType) =>
            [EmploymentType.PENSIONER, EmploymentType.LAWYER, EmploymentType.NOTARY].includes(employmentType),
          otherwise: Yup.object().required('Необходимо указать юрлицо или ИНН'),
        }),
      employerAddress: Yup.object()
        .nullable()
        .when('employmentType', {
          is: (employmentType) => employmentType === EmploymentType.PENSIONER,
          otherwise: Yup.object().required('Необходимо указать фактический адрес'),
        }),
      employerActivity: Yup.string().when('employmentType', {
        is: (employmentType) =>
          [EmploymentType.PENSIONER, EmploymentType.MILITARY, EmploymentType.LAWYER, EmploymentType.NOTARY].includes(
            employmentType,
          ),
        otherwise: Yup.string().nullable().required('Необходимо указать вид деятельности'),
      }),
      employerPhone: Yup.string().when('employmentType', {
        is: EmploymentType.PENSIONER,
        then: Yup.string().notRequired(),
        otherwise: Yup.string().required('Необходимо указать телефон').length(10, 'Телефон состоит из 10 цифр'),
      }),
      lawyerId: Yup.string().when('employmentType', {
        is: EmploymentType.LAWYER,
        then: Yup.string().required('Необходимо указать реестровый номер'),
      }),
      lawyerRegion: Yup.string().when('employmentType', {
        is: EmploymentType.LAWYER,
        then: Yup.string().required('Необходимо указать регион регистрации адвоката'),
      }),
      lawyerLicense: Yup.string().when('employmentType', {
        is: EmploymentType.NOTARY,
        then: Yup.string().required('Необходимо указать номер лицензии'),
      }),
      currentJobExperience: Yup.string().when('employmentType', {
        is: EmploymentType.PENSIONER,
        otherwise: Yup.string().nullable().required('Необходимо указать стаж'),
      }),
      currentJobPosition: Yup.string()
        .nullable()
        .when('employmentType', {
          is: (employmentType) =>
            [EmploymentType.WAGE, EmploymentType.BUSINESS].includes(employmentType) && isAutoCredit,
          then: Yup.string().required('Необходимо указать должность'),
          otherwise: Yup.string().nullable(),
        }),
      currentJobCategory: Yup.string().when('employmentType', {
        is: (employmentType) => employmentType === EmploymentType.WAGE && isAutoCredit,
        then: Yup.string().required('Необходимо указать категорию должности'),
        otherwise: Yup.string().nullable(),
      }),
      profession: Yup.string().when('employmentType', {
        is: (employmentType) => [EmploymentType.WAGE, EmploymentType.BUSINESS].includes(employmentType) && isAutoCredit,
        then: Yup.string().nullable().required('Необходимо указать профессию'),
        otherwise: Yup.string().nullable(),
      }),
      monthlyIncome: Yup.number()
        .nullable()
        .required('Необходимо указать доход в месяц')
        .positive('Должен быть выше нуля')
        .lessThan(10 ** 9, 'Должен быть менее 1 млрд'),
      incomeProofDocumentType:
        creditAmount >= PROOF_CREDIT_SUM
          ? Yup.string().nullable().required('Необходимо указать тип документа')
          : Yup.string().notRequired(),
      additionalIncome: Yup.number()
        .nullable()
        .positive('Должен быть выше нуля')
        .lessThan(10 ** 9, 'Должен быть менее 1 млрд')
        .when('additionalIncomeType', {
          is: (additionalIncomeType) => additionalIncomeType,
          then: Yup.number().required('Необходимо указать доп. доход в месяц'),
        }),
      additionalIncomeType: Yup.string()
        .nullable()
        .when('additionalIncome', {
          is: (additionalIncome) => additionalIncome && isAutoCredit,
          then: Yup.string().required('Необходимо указать тип доп. дохода'),
          otherwise: Yup.string().nullable(),
        }),
      monthlyOutcome: Yup.number()
        .nullable()
        .when('employmentType', {
          is: EmploymentType.PENSIONER,
          otherwise: Yup.number()
            .nullable()
            .min(0)
            .lessThan(10 ** 9, 'Должны быть менее 1 млрд'),
        }),
      additionalMonthlyIncome: Yup.number().when('employmentType', {
        is: (employmentType) => [EmploymentType.LAWYER, EmploymentType.NOTARY].includes(employmentType),
        then: Yup.number()
          .nullable()
          .positive('Должен быть выше нуля')
          .lessThan(10 ** 9, 'Должен быть менее 1 млрд'),
      }),
    },
    [['additionalIncome', 'additionalIncomeType']],
  );

export { EmploymentFieldsetSchema };

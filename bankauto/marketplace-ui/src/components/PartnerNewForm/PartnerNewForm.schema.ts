import * as Yup from 'yup';

const PartnerNewFormSchema = Yup.object().shape({
  city: Yup.string().required('Необходимо указать город'),
  companyType: Yup.string().required('Необходимо указать тип компании'),
  companyName: Yup.string().required('Небходимо указать название').min(2, 'Минимальное количество символов: 2'),
  name: Yup.string().required('Необходимо указать имя').min(2, 'Минимальное количество символов: 2'),
  email: Yup.string().required('Необходимо указать email').email('Некорректный email'),
  phone: Yup.string().required('Необходимо указать телефон').length(10, 'Телефон должен быть длиной 10 символов'),
});

export { PartnerNewFormSchema };

import * as Yup from 'yup';

const FavoriteSubscriptionEmailModalSchema = Yup.object()
  .required()
  .shape({
    email: Yup.string().nullable().email('Некорректный Email').required('Email обязателен для заполнения'),
  });

export { FavoriteSubscriptionEmailModalSchema };

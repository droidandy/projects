import * as Yup from 'yup';

export const EquipmentSchema = Yup.object({
  body: Yup.number().required('Необходимо указать тип кузова').nullable(),
  generation: Yup.number().required('Необходимо указать поколение автомобиля').nullable(),
  transmission: Yup.number().required('Необходимо указать тип коробки передач').nullable(),
  engine: Yup.number().required('Необходимо указать тип двигателя').nullable(),
  drive: Yup.number().required('Необходимо указать привод').nullable(),
  modification: Yup.number().required('Необходимо указать модификацию автомобиля').nullable(),
  color: Yup.number().required('Укажите цвет').nullable(),
}).defined();

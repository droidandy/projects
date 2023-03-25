import * as Yup from 'yup';
import { validateFullAddress } from '../validators';

const AddressFieldsetSchema = (isSimpleCredit: boolean = false) =>
  Yup.object().shape({
    addressMatches: Yup.boolean().required(),
    regAddressType: isSimpleCredit ? Yup.string().notRequired() : Yup.string().required('Необходимо указать тип жилья'),
    regAddress: Yup.object()
      .typeError('Необходимо указать адрес')
      .required('Необходимо указать адрес')
      .test('fullRegAddress', 'Необходимо указать населенный пункт, улицу и номер дома', validateFullAddress),
    factAddress: Yup.object()
      .typeError('Необходимо указать адрес')
      .test('req', 'Необходимо указать населенный пункт, улицу и номер дома', function (value) {
        if (this.parent.addressMatches) return true;
        return value && validateFullAddress(value);
      }),
  });

export { AddressFieldsetSchema };

import { VInputField } from '@invest.wl/mobile';
import { VCustomerPersonalEditModel } from '@invest.wl/view/src/Customer/model/V.CustomerPersonalEdit.model';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVCustomerPersonalFormProps {
  model: VCustomerPersonalEditModel;
  innShow?: boolean;
  snilsShow?: boolean;
}

@observer
export class VCustomerPersonalForm extends React.Component<IVCustomerPersonalFormProps> {
  public static defaultProps = {
    innShow: true,
    snilsShow: true,
  };

  public render() {
    const { model, snilsShow, innShow } = this.props;
    const { inn, snils } = model.fields;

    return (
      <>
        {innShow && (
          <VInputField label={'ИНН'} error={inn.displayErrors}>
            <VInputField.Input value={inn.value} {...inn.inputEvents} />
            <VInputField.Mask mask={inn.maskOptions.mask} />
          </VInputField>
        )}

        {snilsShow && (
          <VInputField mt={innShow ? 'lg' : undefined} label={'СНИЛС'} error={snils.displayErrors}>
            <VInputField.Input value={snils.value} {...snils.inputEvents} />
            <VInputField.Mask mask={snils.maskOptions.mask} />
          </VInputField>
        )}
      </>
    );
  }
}

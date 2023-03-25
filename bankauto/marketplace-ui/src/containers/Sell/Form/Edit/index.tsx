import React, { memo, useCallback, useEffect, useState } from 'react';
import { Form } from 'react-final-form';
import { useRouter } from 'next/router';
import { useBreakpoints, Grid } from '@marketplace/ui-kit';
import { VehicleFormSellValues } from 'types/VehicleFormType';
import { MessageModalName } from 'types/MessageModal';
import { releaseClientVehicleDraft, VehicleCreateParams } from 'api/client/vehicle';
import { useVehicleCreateValues } from 'store/catalog/create/values';
import { makeValidateSync } from 'components/Fields/validation';
import { setFieldTouched } from 'helpers/final-form-touched';
import { EquipmentSchema, HistorySchema, IdentitySchema } from 'containers/VehicleCreate/FieldSet/schema';
import {
  VehicleContactsAdvancedFieldSet,
  VehicleContactsModalFieldSet,
  VehicleDescriptionFieldSet,
  VehicleEquipmentFieldSet,
  VehicleHistoryFieldSet,
  VehicleIdentityFieldSet,
  VehicleMediaFieldSet,
  StickersMultySelect,
  VehicleOptionsFieldSet,
  VehiclePriceFieldSet,
  VehicleSubmitFieldSet,
  VehicleVINFieldSet,
  VehicleSubmitDraft,
} from 'containers/VehicleCreate/FieldSet';
import { getInitialValues, getUpdateParams } from 'containers/VehicleCreate/utils';
import { setFieldDataOptions } from 'helpers/formUtils';
import { FORM_NAME_CREATE } from 'containers/VehicleCreate/constants';
import { VehicleCollapse } from 'containers/VehicleCreate/VehicleCollapse';
import { PreviewCreate } from 'containers/VehicleCreate/Preview';
import { FormSpyData } from 'containers/VehicleCreate/FormSpyData';
import { FormSpyErrors } from 'containers/VehicleCreate/FormSpyErrors';
import { FieldSetWrapper } from 'components/FieldSetWrapper';
import { FieldsContainer } from 'components/FieldsContainer';
import { UserStateListener } from 'containers/VehicleCreate/UserStateListener';
import { useFormVehicleContext } from 'containers/VehicleCreate/FormContext';
import { VehicleAddressFieldSet } from 'containers/VehicleCreate/FieldSet/Address';
import { CreateSchema } from '../schema';
import { useWrapperClasses } from 'containers/VehicleCreate/Form.styles';

const FormBlocksInputs: Record<string, string[]> = {
  equipment: Object.keys(EquipmentSchema.fields),
  media: ['imagesExterior'],
};

const ScenarioModalRecord: Record<string, MessageModalName> = {
  '5': MessageModalName.SELL_CREATED_FOR_CLIENTS,
  '7': MessageModalName.SELL_CREATED,
  '8': MessageModalName.SELL_CREATED_DEALERS_CLIENTS,
};

const validate = makeValidateSync(CreateSchema);

const FormVehicleEditRoot = () => {
  const router = useRouter();
  const { isMobile } = useBreakpoints();
  const { id } = useFormVehicleContext();
  const [loading, setLoading] = useState(false);
  const { root, paperNopt, paperNop } = useWrapperClasses();
  // clear on unmount
  const { clearVehicleCreateValues } = useVehicleCreateValues();
  useEffect(
    () => () => {
      clearVehicleCreateValues();
    },
    [clearVehicleCreateValues],
  );

  const handleEdit = useCallback(
    (values: VehicleFormSellValues) => {
      const createParams = getUpdateParams(values, Number(id!)) as VehicleCreateParams;
      return releaseClientVehicleDraft(createParams)
        .then(() => {
          router.push(`/profile/offers?modal=${ScenarioModalRecord[createParams.vehicle.scenario]}`);
        })
        .catch(() => {});
    },
    [id],
  );

  const initialValues = getInitialValues();

  return (
    <Form
      onSubmit={handleEdit}
      validate={validate}
      initialValues={initialValues}
      subscription={{}}
      mutators={{ setFieldDataOptions, setFieldTouched }}
    >
      {({ handleSubmit }) => (
        <form name={FORM_NAME_CREATE} onSubmit={handleSubmit}>
          <Grid container spacing={!isMobile ? 4 : 0}>
            <Grid item xs={12} sm={9}>
              <VehicleCollapse collapsed>
                <FieldsContainer id="contactsAuthentication" title="Контактные данные" style={{ display: 'none' }}>
                  {/* fixme - remove auth from edit form */}
                  <VehicleContactsModalFieldSet />
                  <UserStateListener />
                </FieldsContainer>
                <FieldsContainer id="brand" title="Марка и модель">
                  <VehicleIdentityFieldSet />
                </FieldsContainer>
                <FieldSetWrapper showValidationSchema={IdentitySchema} useScroll={false}>
                  <FieldsContainer
                    id="equipment"
                    title="Технические характеристики"
                    classes={{ root, paper: paperNopt }}
                  >
                    <VehicleEquipmentFieldSet />
                  </FieldsContainer>
                </FieldSetWrapper>
              </VehicleCollapse>
              <FieldSetWrapper showValidationSchema={EquipmentSchema} useScroll={false}>
                <FieldsContainer id="history" title="История и состояние" classes={{ root }}>
                  <VehicleHistoryFieldSet />
                </FieldsContainer>
              </FieldSetWrapper>
              <FieldSetWrapper showValidationSchema={HistorySchema} useScroll={false} register>
                <FieldsContainer id="price" title="Оценка" classes={{ root }}>
                  <VehiclePriceFieldSet />
                </FieldsContainer>
                <FieldsContainer id="options" transparent classes={{ root, paper: paperNop }}>
                  <VehicleOptionsFieldSet />
                </FieldsContainer>
                <StickersMultySelect
                  name="stickers"
                  title="Выделите Ваш атомобиль среди других"
                  subtitle="Вы можете бесплатно выделить свое объявление, выбрав для отображения от 1 до 3 стикеров"
                  classes={{ root }}
                />
                <FieldsContainer id="description" classes={{ root }}>
                  <VehicleDescriptionFieldSet />
                </FieldsContainer>
                <FieldsContainer id="media" title="Фото и видео" classes={{ root, paper: paperNopt }}>
                  <VehicleMediaFieldSet isEdition />
                </FieldsContainer>
                <FieldsContainer id="vin" classes={{ root }}>
                  <VehicleVINFieldSet />
                </FieldsContainer>
                <FieldsContainer id="address" title="Место осмотра автомобиля" classes={{ root }}>
                  <VehicleAddressFieldSet />
                </FieldsContainer>
                {isMobile ? (
                  <div style={{ paddingTop: '2.75rem' }}>
                    <PreviewCreate />
                  </div>
                ) : null}
              </FieldSetWrapper>
              <FieldSetWrapper showValidationSchema={HistorySchema} useScroll={false}>
                <FieldsContainer id="contactsAdvanced" title="Дополнительно" classes={{ root }}>
                  <VehicleContactsAdvancedFieldSet />
                </FieldsContainer>
                <FieldsContainer id="submit" transparent classes={{ root, paper: paperNopt }}>
                  <Grid container spacing={isMobile ? 2 : 4}>
                    <Grid item xs={12} sm={8}>
                      <VehicleSubmitFieldSet buttonText="Опубликовать" loading={loading} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <VehicleSubmitDraft loading={loading} setLoading={setLoading} />
                    </Grid>
                  </Grid>
                </FieldsContainer>
              </FieldSetWrapper>
            </Grid>
            {!isMobile ? (
              <Grid item xs={12} sm={3}>
                <div style={{ paddingTop: '2.75rem', position: 'sticky', top: '5.75rem' }}>
                  <PreviewCreate />
                </div>
              </Grid>
            ) : null}
          </Grid>
          <FormSpyData />
          <FormSpyErrors formName={FORM_NAME_CREATE} blocks={FormBlocksInputs} />
        </form>
      )}
    </Form>
  );
};

export const FormVehicleEdit = memo(FormVehicleEditRoot);

import React, { memo, useCallback, useEffect, useState, FC } from 'react';
import { useSelector } from 'react-redux';
import { Form, useField } from 'react-final-form';
import { useRouter } from 'next/router';
import { setFieldTouched } from 'helpers/final-form-touched';
import { useBreakpoints, Grid } from '@marketplace/ui-kit';
import { releaseClientVehicleDraft, VehicleCreateParams } from 'api/client/vehicle';
import { VehicleFormSellValues } from 'types/VehicleFormType';
import { MessageModalName } from 'types/MessageModal';
import { StateModel } from 'store/types';
import { useVehicleCreateValues } from 'store/catalog/create/values';
import { makeValidateSync } from 'components/Fields/validation';
import {
  AuthorizationSchema,
  EquipmentSchema,
  HistorySchema,
  IdentitySchema,
} from 'containers/VehicleCreate/FieldSet/schema';
import { useVehicleDraftData } from 'store/catalog/vehicleDraft';
import { useVehicleCreateData } from 'store/catalog/create/data';
import {
  VehicleContactsModalFieldSet,
  VehicleContactsAdvancedFieldSet,
  VehicleDescriptionFieldSet,
  VehicleEquipmentFieldSet,
  VehicleHistoryFieldSet,
  VehicleIdentityFieldSet,
  VehicleMediaFieldSet,
  VehicleOptionsFieldSet,
  StickersMultySelect,
  VehiclePriceFieldSet,
  VehicleSubmitFieldSet,
  VehicleSubmitDraft,
  VehicleVINFieldSet,
} from 'containers/VehicleCreate/FieldSet';
import { FORM_NAME_CREATE } from 'containers/VehicleCreate/constants';
import { VehicleCollapse } from 'containers/VehicleCreate/VehicleCollapse';
import { StepBlock } from 'containers/VehicleCreate/StepBlock';
import { UserStateListener } from 'containers/VehicleCreate/UserStateListener';
import { PreviewCreate } from 'containers/VehicleCreate/Preview';
import { FormSpyData } from 'containers/VehicleCreate/FormSpyData';
import { FormSpyErrors } from 'containers/VehicleCreate/FormSpyErrors';
import { VehicleAddressFieldSet } from 'containers/VehicleCreate/FieldSet/Address';
import { FieldSetWrapper } from 'components/FieldSetWrapper';
import { FieldsContainer } from 'components/FieldsContainer';
import { getCreateParams, getInitialValues } from 'containers/VehicleCreate/utils';
import { CreateSchema } from '../schema';
import { useLeaveConfirm } from 'hooks/useLeaveConfirm';
import { EventLabel, fireSellCreateAnalytics } from 'helpers/analytics/sell_create';
import { setFieldDataOptions } from 'helpers';
import { getCookieImpersonalization } from 'helpers/authCookies';
import { useWrapperClasses } from 'containers/VehicleCreate/Form.styles';

const FormBlocksInputs: Record<string, string[]> = {
  equipment: Object.keys(EquipmentSchema.fields),
  media: ['imagesExterior'],
};

const FormRegistration = () => {
  const {
    input: { value: isAuthorized },
  } = useField('authSuccess', { subscription: { value: true } });
  return (
    <FieldsContainer
      id="contactsAuthentication"
      title="Для публикации объявления необходимо авторизоваться"
      style={{ display: isAuthorized ? 'none' : 'block' }}
    >
      <VehicleContactsModalFieldSet />
      <UserStateListener />
    </FieldsContainer>
  );
};

const FormSpyDataOnAuth = () => {
  const {
    input: { value: isAuthorized },
  } = useField('authSuccess', { subscription: { value: true } });
  return isAuthorized ? <FormSpyData /> : null;
};

const FormSubmission: FC = () => {
  const { isMobile } = useBreakpoints();
  const { root, paperNopt } = useWrapperClasses();
  const [loading, setLoading] = useState(false);
  const authSuccess = useSelector(
    (state: StateModel) => state.user.isAuthorized && (!!state.user.firstName || getCookieImpersonalization()),
    () => true, // only on mount
  );

  return (
    <FieldSetWrapper useScroll={!authSuccess}>
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
  );
};

const validate = makeValidateSync(CreateSchema);

const ScenarioModalRecord: Record<string, MessageModalName> = {
  '5': MessageModalName.SELL_CREATED_FOR_CLIENTS,
  '7': MessageModalName.SELL_CREATED,
  '8': MessageModalName.SELL_CREATED_DEALERS_CLIENTS,
};

const FormVehicleCreateRoot = () => {
  const router = useRouter();
  const { isMobile } = useBreakpoints();
  const { root, paperNopt, paperNop } = useWrapperClasses();
  const {
    state: {
      params: { id: draftId },
    },
  } = useVehicleCreateData();
  const { setSentStatus } = useVehicleDraftData();
  const { clearVehicleCreateValues } = useVehicleCreateValues();

  useLeaveConfirm({ allowedRoutes: ['offers', 'sell/create'] });

  useEffect(
    () => () => {
      setSentStatus(true);
      clearVehicleCreateValues();
    },
    [],
  );

  const handleCreate = useCallback(
    (values: VehicleFormSellValues) => {
      const createParams = getCreateParams(values, draftId) as VehicleCreateParams;
      return releaseClientVehicleDraft(createParams)
        .then(() => {
          fireSellCreateAnalytics(EventLabel.FORM_COMPLETED);
          setSentStatus(true);
          router.push(`/profile/offers?modal=${ScenarioModalRecord[createParams.vehicle.scenario]}`);
        })
        .catch(() => {});
    },
    [draftId, setSentStatus],
  );

  const initialValues = getInitialValues();

  return (
    <Form
      onSubmit={handleCreate}
      validate={validate}
      initialValues={initialValues}
      subscription={{}}
      mutators={{ setFieldDataOptions, setFieldTouched }}
    >
      {({ handleSubmit }) => (
        <form name={FORM_NAME_CREATE} onSubmit={handleSubmit}>
          <Grid container spacing={!isMobile ? 4 : 0}>
            <Grid item xs={12} sm={9}>
              <FormRegistration />
              <VehicleCollapse>
                <FieldSetWrapper showValidationSchema={AuthorizationSchema} register>
                  <FieldsContainer id="brand" title="Марка и модель" classes={{ root }}>
                    <VehicleIdentityFieldSet />
                  </FieldsContainer>
                </FieldSetWrapper>
                <FieldSetWrapper showValidationSchema={AuthorizationSchema.concat(IdentitySchema)} register>
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
              <FieldSetWrapper showValidationSchema={HistorySchema}>
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
                  <VehicleMediaFieldSet />
                </FieldsContainer>
                <FieldsContainer id="vin" classes={{ root }}>
                  <VehicleVINFieldSet />
                </FieldsContainer>
                <FieldsContainer id="address" title="Место осмотра автомобиля" classes={{ root }}>
                  <VehicleAddressFieldSet />
                </FieldsContainer>
              </FieldSetWrapper>
            </Grid>
            <Grid item sm={3}>
              <StepBlock route="/sell/create" />
            </Grid>
          </Grid>
          <FieldSetWrapper showValidationSchema={HistorySchema} useScroll={false}>
            <Grid
              container
              direction={isMobile ? 'column-reverse' : 'row'}
              spacing={isMobile ? 0 : 4}
              style={{ paddingTop: '2.5rem' }}
            >
              <Grid item xs={12} sm={9}>
                <FieldsContainer id="contactsAdvanced" title="Дополнительно">
                  <VehicleContactsAdvancedFieldSet />
                </FieldsContainer>
                <FormSubmission />
              </Grid>
              <Grid item xs={12} sm={3}>
                <div style={{ paddingTop: isMobile ? 0 : '2.75rem' }}>
                  <PreviewCreate />
                </div>
              </Grid>
            </Grid>
          </FieldSetWrapper>
          <FormSpyDataOnAuth />
          <FormSpyErrors formName={FORM_NAME_CREATE} blocks={FormBlocksInputs} />
        </form>
      )}
    </Form>
  );
};

export const FormVehicleCreate = memo(FormVehicleCreateRoot);

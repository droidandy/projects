import React from 'react';
import { getSettingState } from '../interface';
import { Page } from 'src/components/Page';
import { Portlet } from 'src/components/Portlet';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import { settingTypeOptions } from 'src/common/options';
import {
  SiteSettingFormProvider,
  SiteSettingFormActions,
  getSiteSettingFormState,
} from '../setting-form';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { RequiredNote } from 'src/components/RequiredNote';
import { BackButton } from 'src/components/BackButton';
import { useActions } from 'typeless';
import { SaveButtons } from 'src/components/SaveButtons';
import { FormSelect } from '../../../components/FormSelect';
import { Input } from '../../../components/FormInput';
import { keyReg } from '../../../common/helper';
import { Trans } from 'react-i18next';

export const SiteSettingView = () => {
  const { isLoading, isSaving } = getSettingState.useState();
  const { submit, change, blur } = useActions(SiteSettingFormActions);
  const {
    values: formValues,
    errors,
    touched,
  } = getSiteSettingFormState.useState();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyValue = e.target.value;
    if (!keyValue) {
      return;
    }
    const formattedValue = keyValue
      .toLowerCase()
      .replace(/[ _]+/g, '_')
      .replace(keyReg, '');
    return change('key', formattedValue);
  };

  const renderDetails = () => {
    if (isLoading) {
      return <DetailsSkeleton />;
    }
    return (
      <SiteSettingFormProvider>
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <BackButton href="/settings/site-settings" />
          <RequiredNote />
          <FormItem label="Name" required>
            <FormInput name="name" langSuffix />
          </FormItem>
          <FormItem label="Description" required>
            <FormInput multiline name="description" langSuffix />
          </FormItem>
          <FormItem label="Setting type" required>
            <FormSelect name="type" options={settingTypeOptions} />
          </FormItem>
          <FormItem label="Key" required>
            <Input
              name="key"
              value={formValues.key || ''}
              error={
                touched.key && errors.key ? <Trans>{errors.key}</Trans> : null
              }
              onBlur={() => blur('key')}
              onChange={handleChange}
              required
            />
          </FormItem>
          <FormItem label="Value" required>
            <FormInput name="value" />
          </FormItem>
          <button type="submit" style={{ display: 'none' }} />
        </form>
        <SaveButtons
          onCancel="/settings/site-settings"
          onSave={submit}
          isSaving={isSaving}
        />
      </SiteSettingFormProvider>
    );
  };

  return (
    <>
      <Page>
        <Portlet padding>{renderDetails()}</Portlet>
      </Page>
    </>
  );
};

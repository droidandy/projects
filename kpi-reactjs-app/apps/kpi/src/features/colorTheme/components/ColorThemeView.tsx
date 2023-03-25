import React from 'react';
import { getColorThemeState } from '../interface';
import { Page } from 'src/components/Page';
import { Portlet } from 'src/components/Portlet';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import {
  ColorThemeFormProvider,
  ColorThemeFormActions,
} from '../colorTheme-form';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { RequiredNote } from 'src/components/RequiredNote';
import { BackButton } from 'src/components/BackButton';
import { useActions } from 'typeless';
import { SaveButtons } from 'src/components/SaveButtons';
import { ColorThemeProps } from 'src/const';
import { ThemeVars } from 'src/types-next';

const labelMapping: ThemeVars = {
  headerBg: 'Header Background',
};

export const ColorThemeView = () => {
  const { isLoading, isSaving } = getColorThemeState.useState();
  const { submit } = useActions(ColorThemeFormActions);

  const renderDetails = () => {
    if (isLoading) {
      return <DetailsSkeleton />;
    }
    return (
      <ColorThemeFormProvider>
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <BackButton href="/settings/color-themes" />
          <RequiredNote />
          <FormItem label="Name" required>
            <FormInput name="name" langSuffix />
          </FormItem>
          {ColorThemeProps.map(prop => (
            <FormItem label={labelMapping[prop]} required key={prop}>
              <FormInput name={prop} />
            </FormItem>
          ))}

          <button type="submit" style={{ display: 'none' }} />
        </form>
        <SaveButtons
          onCancel="/settings/color-themes"
          onSave={submit}
          isSaving={isSaving}
        />
      </ColorThemeFormProvider>
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

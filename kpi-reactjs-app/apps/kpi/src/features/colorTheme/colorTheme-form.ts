import { createForm } from 'typeless-form';
import { ColorThemeFormSymbol } from './symbol';
import { validateString, validateLangString } from 'src/common/helper';
import { ColorThemeProps } from 'src/const';

export interface ColorThemeFormValues {
  name_en: string;
  name_ar: string;

  [x: string]: string;
}

export const [
  useColorThemeForm,
  ColorThemeFormActions,
  getColorThemeFormState,
  ColorThemeFormProvider,
] = createForm<ColorThemeFormValues>({
  symbol: ColorThemeFormSymbol,
  validator: (errors, values) => {
    validateLangString(errors, values, 'name');

    ColorThemeProps.forEach(prop => {
      validateString(errors, values, prop);
    });
  },
});

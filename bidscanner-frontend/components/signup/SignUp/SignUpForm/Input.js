// @flow

import Input from 'components/styled/Input';
/* TODO: to understand why types doesn't work if we try to import as
  'types/redux-form', with eslint alias
*/
import type { MetaProps, InputProps } from 'redux-form';
import ErrorText from 'components/styled/ErrorText';
import styled from 'styled-components';

const NameInput = Input.extend`max-width: 100%;`;
const Div = styled.div`width: 102.5px;`;

type PropsFromField = {
  type: string,
  placeholder?: string,
  meta: MetaProps,
  input: InputProps,
};

export default (field: PropsFromField) =>
  <Div>
    <NameInput type={field.type} placeholder={field.placeholder} {...field.input} />
    <div className="mt-2">
      {/* TODO:investigate, not like in redux docs, see renderField here, http://redux-form.com/6.7.0/examples/fieldLevelValidation/ */}
      {field.meta &&
        field.meta.touched &&
        field.meta.error &&
        <ErrorText>
          {field.meta.error}
        </ErrorText>}
    </div>
  </Div>;

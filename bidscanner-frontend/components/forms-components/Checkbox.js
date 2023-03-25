// @flow
import type { MetaProps, InputProps } from 'redux-form';
import ErrorText from 'components/styled/ErrorText';
import styled from 'styled-components';

type PropsFromField = {
  type: string,
  placeholder?: string,
  meta: MetaProps,
  input: InputProps,
};

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: black;

  & > span {
    margin-left: 10px;
  }
`;

const formInput = (field: PropsFromField) =>
  <div>
    <div>
      <Checkbox>
        <input type="checkbox" id="checkboxFiveInput" {...field.input} />
        <span>Stay connected</span>
      </Checkbox>
    </div>
    {field.meta.touched &&
      field.meta.error &&
      <div className="pt-1">
        <ErrorText>
          {field.meta.error}
        </ErrorText>
      </div>}
  </div>;

export default formInput;

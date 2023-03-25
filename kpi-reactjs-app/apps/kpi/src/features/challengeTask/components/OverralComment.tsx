import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { booleanOptions } from 'src/common/options';
import React from 'react';
import { FormSelect } from 'src/components/FormSelect';
import { FormInput } from 'src/components/ReduxInput';

const Wrapper = styled.div`
  margin-top: 20px;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  align-items: center;
`;

const SelectWrapper = styled.div`
  width: 80px;
`;

export function OverallComment() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Top>
        {t(
          'Does the concerned unit satisfy the  actions requested (even if not all were resolved)?  *'
        )}
        <SelectWrapper>
          <FormSelect
            name="isAccepted"
            options={booleanOptions}
            placeholder="-"
          />
        </SelectWrapper>
      </Top>
      <FormInput name="acceptedComment" multiline />
    </Wrapper>
  );
}

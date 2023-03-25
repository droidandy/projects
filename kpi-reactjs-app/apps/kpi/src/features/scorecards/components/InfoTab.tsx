import React from 'react';
import { FormItemLabel } from 'src/components/FormItem';
import styled from 'styled-components';
import { getScorecardsState, ScorecardsActions } from '../interface';
import { useActions } from 'typeless';
import { SaveButtonsNext } from 'src/components/SaveButtonsNext';
import { EditButtonBar } from './EditButtonBar';
import { ResourceForm } from 'src/features/resource/components/ResourceForm';

const Wrapper = styled.div`
  margin-bottom: -15px;
`;
const Inner = styled.div`
  padding-bottom: 40px;
  ${FormItemLabel} {
    width: 110px;
  }
`;

export function InfoTab() {
  const { isAdding, isSaving, isEditing } = getScorecardsState.useState();
  const { save, cancelAdd } = useActions(ScorecardsActions);

  return (
    <Wrapper>
      <Inner>
        <ResourceForm isEditing={isEditing} isAdding={isAdding} />
      </Inner>
      {isEditing ? (
        <SaveButtonsNext
          isSaving={isSaving}
          save={save}
          cancelAdd={cancelAdd}
        />
      ) : (
        <EditButtonBar />
      )}
    </Wrapper>
  );
}

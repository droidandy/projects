import * as React from 'react';
import styled from 'styled-components';
import { ChallengeAction } from 'src/types-next';
import { useTranslation } from 'react-i18next';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { AddResponse } from './AddResponse';
import { getChallengeTaskState } from '../interface';
import { FormSelect } from 'src/components/FormSelect';
import { booleanOptions } from 'src/common/options';

interface ActionDetailsProps {
  className?: string;
  action: ChallengeAction;
  index: number;
}

const Wrapper = styled.div`
  border-top: 1px solid #ebedf2;
  padding: 15px;
`;

const Comment = styled.div`
  border-top: 1px solid #ebedf2;
  padding: 15px;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
`;

const SelectWrapper = styled.div`
  width: 80px;
  margin-left: 25px;
`;

export function ActionDetails(props: ActionDetailsProps) {
  const { action, index } = props;
  const { t } = useTranslation();
  const { taskType } = getChallengeTaskState.useState();

  return (
    <Wrapper>
      <Top>
        <Left>
          {t('Action')} {index + 1}: <DisplayTransString value={action.name} />
        </Left>
        <Right>
          {t('added by')}:{' '}
          <DisplayTransString value={action.addedByUser.name} />
          {taskType === 'ChallengeResponseReview' && (
            <SelectWrapper>
              <FormSelect
                name={`answer_${action.id}`}
                options={booleanOptions}
                placeholder="-"
              />
            </SelectWrapper>
          )}
        </Right>
      </Top>
      {action.comments.map(comment => (
        <Comment key={comment.id}>
          {t('Comment')}:
          <br />
          {comment.text}
        </Comment>
      ))}
      <AddResponse challengeActionId={action.id} />
    </Wrapper>
  );
}

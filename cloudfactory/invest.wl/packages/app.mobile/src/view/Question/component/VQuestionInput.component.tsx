import { IVFlexProps, VCol, VInputField, VText, VTooltip } from '@invest.wl/mobile';
import { IVQuestionModel } from '@invest.wl/view/src/Question/model/V.Question.model';
import { makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVQuestionInputProps extends IVFlexProps {
  model: IVQuestionModel;
}

@observer
export class VQuestionInput extends React.Component<IVQuestionInputProps> {
  constructor(props: IVQuestionInputProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const { model, ...flexProps } = this.props;

    return (
      <VCol {...flexProps}>
        {!!model.description && (
          <VCol absolute right top={!!model.name ? 12 : 0} zIndex={2}>
            <VTooltip text={model.description}><VTooltip.HintIcon /></VTooltip>
          </VCol>
        )}
        {!!model.name && <VText mr={'lg'} font={'body16'}>{model.name}</VText>}
        <VInputField mt={!!model.name ? 'xs' : undefined} label={model.text}>
          <VInputField.Input value={model.answer} {...model.domain.answerSet} />
        </VInputField>
      </VCol>
    );
  }
}

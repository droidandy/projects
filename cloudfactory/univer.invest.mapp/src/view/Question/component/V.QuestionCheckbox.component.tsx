import React from 'react';
import { observer } from 'mobx-react';
import { themeStyle } from '@invest.wl/mobile/src/view/Theme/V.Theme.util';
import { IVFlexProps, VCheckBox, VCol, VText, VTooltip } from '@invest.wl/mobile/src/view/kit';
import { IVQuestionModel } from '@invest.wl/view/src/Question/model/V.Question.model';

export interface IVQuestionCheckboxProps extends IVFlexProps {
  model: IVQuestionModel;
}

@observer
export class VQuestionCheckbox extends React.Component<IVQuestionCheckboxProps> {
  public render() {
    const { model, ...flexProps } = this.props;

    return (
      <VCol {...flexProps}>
        {!!model.description && (
          <VCol absolute right top zIndex={2} hitSlop={themeStyle.hitSlop16}>
            <VTooltip text={model.description}><VTooltip.HintIcon /></VTooltip>
          </VCol>
        )}
        <VCheckBox mr={'lg'} isChecked={model.domain.isTrue}
          onPress={model.domain.answerSet} context={!model.domain.isTrue}>
          <VCheckBox.Text>
            <VCol pl={'md'} pt={'xs'}>
              {!!model.name && <VText font={'body16'}>{model.name}</VText>}
              {!!model.text &&
              <VText mt={!!model.name ? 'md' : undefined} font={'body16'}>{model.text}</VText>}
            </VCol>
          </VCheckBox.Text>
        </VCheckBox>
      </VCol>
    );
  }
}

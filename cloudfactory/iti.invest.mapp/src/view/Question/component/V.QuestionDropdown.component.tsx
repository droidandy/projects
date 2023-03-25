import React from 'react';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { IQuestionOptionDTO, TQuestionAnswerValue } from '@invest.wl/system/src/Transport/Question';
import { IVQuestionModel } from '@invest.wl/view/src/Question/model/V.Question.model';
import { IVFlexProps, VCol, VSelect, VTooltip } from '@invest.wl/mobile/src/view/kit';
import { IVSelectDataItem } from '@invest.wl/mobile/src/view/kit/Input/Select/V.Select.types';

export interface IVQuestionDropdownProps extends IVFlexProps {
  model: IVQuestionModel;
}

@observer
export class VQuestionDropdown extends React.Component<IVQuestionDropdownProps, any> {
  constructor(props: IVQuestionDropdownProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get _optionList(): IVSelectDataItem<TQuestionAnswerValue>[] {
    const { optionList } = this.props.model;
    if (!optionList) return [];
    return optionList.map(o => ({ value: o.value, name: o.text }));
  }

  @computed
  public get optionSelected(): IQuestionOptionDTO | undefined {
    const { answer, optionList } = this.props.model;
    return answer ? optionList?.find(o => o.value === answer) : undefined;
  }

  public render() {
    const { model, ...flexProps } = this.props;
    if (!model.optionList) return null;

    const selected = model.answer ?? model.name ?? '';

    return (
      <VCol {...flexProps}>
        {!!model.description && (
          <VCol absolute top={-4} right zIndex={2}><VTooltip flex
            text={model.description}><VTooltip.HintIcon /></VTooltip></VCol>
        )}
        <VSelect.Dropdown title={model.name || ''} placeholder={model.text} selected={selected}
          data={this._optionList} onChange={model.domain.answerSet} />
      </VCol>
    );
  }
}

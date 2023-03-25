import React from 'react';
import { observer } from 'mobx-react';
import { computed, makeObservable } from 'mobx';
import { IVQuestionModel } from '@invest.wl/view/src/Question/model/V.Question.model';
import { IVFlexProps, VCol, VRow, VSelect, VText, VTooltip } from '@invest.wl/mobile/src/view/kit';
import { isBoolean } from 'lodash';
import { IVSelectData } from '@invest.wl/mobile/src/view/kit/Input/Select/V.Select.types';

export interface IVQuestionRadioProps extends IVFlexProps {
  model: IVQuestionModel;
}

@observer
export class VQuestionRadio extends React.Component<IVQuestionRadioProps> {
  constructor(props: IVQuestionRadioProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  public get _list(): IVSelectData<any> {
    const { optionList } = this.props.model;
    if (!optionList) return [];
    return optionList.map(o => ({ value: o.value, name: o.text, hint: o.description }));
  }

  @computed
  public get isBoolean() {
    const { optionList } = this.props.model;
    return optionList?.length === 2 && optionList.every(o => isBoolean(o.value.toString()));
  }

  public render() {
    const { model, ...flexProps } = this.props;

    // const InnerComponent = this.isBoolean ? VRow : VCol;

    return (
      <VCol {...flexProps}>
        <VRow>
          <VCol flex>
            {!!model.name && <VText font={'body16'}>{model.name}</VText>}
            {!!model.text &&
            <VText mt={!!model.name ? 'md' : undefined} font={'body16'}>{model.text}</VText>}
          </VCol>
          {!!model.description && (
            <VTooltip text={model.description}><VTooltip.HintIcon /></VTooltip>
          )}
        </VRow>
        <VSelect.Radio data={this._list} selected={model.answer} onChange={model.domain.answerSet} />
        {/*<InnerComponent mt={this.isBoolean ? 'lg' : undefined}>{this._renderList()}</InnerComponent>*/}
      </VCol>
    );
  }

  // private _renderList() {
  //   const { optionList, answer, domain } = this.props.model;
  //   return optionList?.map(o => {
  //     const isSelected = answer === o.value;
  //     const text = <VText ml={'lg'} font={'body18'}>{o.text}</VText>;
  //     const textView = o.description && isSelected ? (
  //       <VTooltip text={o.description}><VTooltip.View>{text}</VTooltip.View></VTooltip>) : text;
  //     return (
  //       <VSelectRadio flex mt={!this.isBoolean ? 'lg' : undefined} data={}
  //         key={o.value.toString()} selected={isSelected} onChange={domain.answerSet}
  //         context={o.value}>
  //         <VSelectRadio.Component>
  //           {textView}
  //         </VSelectRadio.Component>
  //       </VSelectRadio>
  //     );
  //   });
  // }
}

import React from 'react';
import { VQuestionCheckbox } from './V.QuestionCheckbox.component';
import { VQuestionRadio } from './V.QuestionRadio.component';
import { VQuestionDropdown } from './V.QuestionDropdown.component';
import { VQuestionInput } from './VQuestionInput.component';
import { VQuestionFile } from './V.QuestionFile.component';
import { observer } from 'mobx-react';
import { EDQuestionDisplayType } from '@invest.wl/core';
import { IVQuestionModel } from '@invest.wl/view/src/Question/model/V.Question.model';
import { IVFlexProps } from '@invest.wl/mobile/src/view/kit';

export interface IVQuestionProps extends IVFlexProps {
  model: IVQuestionModel;
}

@observer
export class VQuestion extends React.Component<IVQuestionProps> {
  private static _type2component = {
    [EDQuestionDisplayType.Checkbox]: VQuestionCheckbox,
    [EDQuestionDisplayType.Radio]: VQuestionRadio,
    [EDQuestionDisplayType.Dropdown]: VQuestionDropdown,
    [EDQuestionDisplayType.Input]: VQuestionInput,
    [EDQuestionDisplayType.File]: VQuestionFile,
  };

  public render() {
    const { displayType } = this.props.model.domain.dto;
    const Component = VQuestion._type2component[displayType];
    if (!Component) {
      if (__DEV__) console.error(`Тип вопроса ${displayType} не предусмотрен`);
      return null;
    }
    return <Component {...this.props} />;
  }
}

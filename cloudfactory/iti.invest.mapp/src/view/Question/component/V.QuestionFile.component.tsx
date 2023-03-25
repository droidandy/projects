import React from 'react';
import { observer } from 'mobx-react';
import { computed, makeObservable } from 'mobx';
import { IVQuestionModel } from '@invest.wl/view/src/Question/model/V.Question.model';
import { IVFlexProps, VCol, VText, VTooltip } from '@invest.wl/mobile/src/view/kit';

export interface IVQuestionFileProps extends IVFlexProps {
  model: IVQuestionModel;
}

@observer
export class VQuestionFile extends React.Component<IVQuestionFileProps> {
  constructor(props: IVQuestionFileProps) {
    super(props);
    makeObservable(this);
  }

  // private _upload = new Upload();

  @computed
  public get hasName() {
    return !!this.props.model.name;
  }

  public render() {
    const { model, ...flexProps } = this.props;

    return (
      <VCol {...flexProps}>
        {!!model.description && (
          <VCol absolute right top zIndex={2}>
            <VTooltip text={model.description}><VTooltip.HintIcon /></VTooltip>
          </VCol>
        )}
        {this.hasName && <VText font={'body16'}>{model.name}</VText>}
        {/*<VButton.Upload*/}
        {/*  onPress={this._uploadFile} mt={this.hasName ? 'md' : undefined}*/}
        {/*  borderColor={colors.decorMedium}*/}
        {/*>*/}
        {/*  <Text pt={8} textStyle={'semibold14'} color={colors.decorGray}>{model.answer ?? dto.text}</Text>*/}
        {/*</VButton.Upload>*/}
      </VCol>
    );
  }

  // private _uploadFile = async () => {
  //   // TODO: FIXME!
  //   // this._appStateChangeListener.onChangeAdd(VQuestionFile._onChangeReducer);
  //   const file = await DocumentPicker.pick({
  //     type: [DocumentPicker.types.allFiles, DocumentPicker.types.zip],
  //   });
  //   // .finally(() => (
  //   // this._appStateChangeListener.onChangeRemove(VQuestionFile._onChangeReducer)),
  //   // );
  //   const uploadFile = await this._upload.send(file);
  //   if (uploadFile) this.props.model.answerFileSet(uploadFile.submit);
  // };

  // private static _onChangeReducer: TOnChangeReducer = (state) => AppState.active;
}

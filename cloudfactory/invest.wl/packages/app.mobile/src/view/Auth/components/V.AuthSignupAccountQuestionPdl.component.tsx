import { EDQuestionSection, IoC } from '@invest.wl/core';
import { DNotificationStoreTid, IDNotificationStore } from '@invest.wl/domain/src/Notification/D.Notification.types';
import { VButton, VCol, VText } from '@invest.wl/mobile';
import { IVAuthSignupWithAccountStepProps } from '@invest.wl/view/src/Auth/present/SignupWithAgreement/V.AuthSignupWithAgreement.types';
import { observer } from 'mobx-react';
import React from 'react';
import { VQuestionSection } from '../../Question/component/V.QuestionSection.component';

@observer
export class VAuthSignupAccountQuestionPdlForm extends React.Component<IVAuthSignupWithAccountStepProps> {
  private _notification = IoC.get<IDNotificationStore>(DNotificationStoreTid);

  public render() {
    const { agreementCreatePr: { questionSectionPdlX, cse: { isBusy } } } = this.props.present;

    return (
      <VCol flex>
        <VText mb={'lg'} ta={'center'} font={'body7'}>Подтверждаю</VText>
        <VQuestionSection section={EDQuestionSection.PDL} list={questionSectionPdlX.list} titleShow={false} />
        <VCol flex />
        <VButton.Fill mt={'xl'} onPress={this._next} disabled={isBusy}>Далее</VButton.Fill>
      </VCol>
    );
  }

  private _next = () => {
    const { stepNext, agreementCreatePr } = this.props.present;
    if (agreementCreatePr.cse.isPDLValid) stepNext();
    else this._notification.errorAdd('Для дальнейшего оформления вам необходимо подъехать в офис');
  };
}

// import { observer } from 'mobx-react';
// import React from 'react';
// import { computed } from 'mobx';
// import { colors } from 'src/view/Theme';
// import { DAuthSignupCase } from '@invest.wl/domain/src/Auth/case/D.AuthSignup.case';
// import { VCol, VText } from '@invest.wl/mobile/src/view/kit';
// import { VButton } from '@invest.wl/mobile/src/view/kit/Button/V.Button.component';
// import { Formatter } from '@invest.wl/common/src/util/formatter.util';
//
// interface IAuthEmailConfirmProps {
//   case: Pick<DAuthSignupCase, 'model' | 'codeSent' | 'isBusy'>;
//   onConfirm(): void;
// }
//
// @observer
// export class AuthEmailConfirm extends React.Component<IAuthEmailConfirmProps> {
//   @computed
//   public get resendSmsTitle() {
//     const { smsResendIsAllow, smsResendTime } = this.props.case;
//
//     return smsResendIsAllow
//       ? 'Повторно отправить'
//       : `Запросить код повторно через ${Formatter.timer(smsResendTime)}`;
//   }
//
//   public render() {
//     return this.props.case.codeSent ? this._renderCode() : this._renderEmail();
//   }
//
//   private _renderEmail() {
//     const caseSignup = this.props.case;
//     const email = caseSignup.emailField;
//
//     return (
//       <>
//         {/*<VInputField error={email.displayErrors}>*/}
//         {/*  <VInputField.Input*/}
//         {/*    {...email.inputEvents}*/}
//         {/*    placeholder={'E-mail'}*/}
//         {/*    value={email.inputValue}*/}
//         {/*    keyboardType={'email-address'}*/}
//         {/*    disabled={caseSignup.isBusy}*/}
//         {/*  />*/}
//         {/*</VInputField>*/}
//         <VButton.Fill onPress={caseSignup.emailSet} disabled={!email.isValid} mt={20}>
//           Получить код
//         </VButton.Fill>
//       </>
//     );
//   }
//
//   private _renderCode() {
//     const caseSignup = this.props.case;
//     const code = caseSignup.codeField;
//
//     return (
//       <>
//         <VText ta={'center'} mt={'xl_md'} font={'body8'} color={colors.decorGray}>
//           На ваш e-mail отправлено письмо с кодом подтверждения
//         </VText>
//         <VCol flex alignItems={'center'} mt={'lg_sm'}>
//           {/*<VInputField error={code.displayErrors}>*/}
//           {/*  <VInputField.Input*/}
//           {/*    {...code.inputEvents}*/}
//           {/*    placeholder={'Код из e-mail'}*/}
//           {/*    value={code.inputValue}*/}
//           {/*    keyboardType={'email-address'}*/}
//           {/*    disabled={caseSignup.isBusy}*/}
//           {/*  />*/}
//           {/*</VInputField>*/}
//           <VButton.Text onPress={caseSignup.emailSmsResend} disabled={!caseSignup.smsResendIsAllow} mt={'xl_md'}>
//             {this.resendSmsTitle}
//           </VButton.Text>
//         </VCol>
//         <VCol flex />
//         <VButton.Fill onPress={this.props.onConfirm} disabled={!code.isValid} mt={20}>
//           Подтвердить
//         </VButton.Fill>
//       </>
//     );
//   }
// }

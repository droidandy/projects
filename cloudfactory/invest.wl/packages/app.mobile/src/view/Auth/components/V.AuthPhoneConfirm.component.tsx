// import { observer } from 'mobx-react';
// import React from 'react';
// import { computed } from 'mobx';
// import { colors } from 'src/view/Theme';
// import { DAuthSignupCase } from '@invest.wl/domain/src/Auth/case/D.AuthSignup.case';
//
// import { Linking } from 'react-native';
// import { VButton, VCol, VText, VTouchable } from '@invest.wl/mobile';
// import { VCheckBox } from '@invest.wl/mobile';
// import { Formatter } from '@invest.wl/common/src/util/formatter.util';
//
// interface IAuthPhoneConfirmProps {
//   case: DAuthSignupCase;
//   onConfirm(): void;
// }
//
// @observer
// export class AuthPhoneConfirm extends React.Component<IAuthPhoneConfirmProps> {
//   @computed
//   public get resendSmsTitle() {
//     const { smsResendIsAllow, smsResendTime } = this.props.case;
//
//     return smsResendIsAllow
//       ? 'Повторно отправить'
//       : `Запросить код повторно через ${Formatter.timer(smsResendTime)}`;
//   }
//
//   @computed
//   private get _isValidForm() {
//     const { phoneField, personalDataAgreementAgree, edmAgreementAgree, securityGuidelineAgree } = this.props.case;
//
//     return phoneField.isValid && personalDataAgreementAgree && edmAgreementAgree && securityGuidelineAgree;
//   }
//
//   public render() {
//     return this.props.case.codeSent ? this._renderCode() : this._renderPhone();
//   }
//
//   private _renderPhone() {
//     const useCase = this.props.case;
//     // const phone = useCase.phoneField;
//
//     return (
//       <>
//         {/*<VCol mt={'xl_lg'}>*/}
//         {/*  <MasketTextInput*/}
//         {/*    {...phone.inputEvents}*/}
//         {/*    type={'custom'}*/}
//         {/*    options={this.textInputOptions}*/}
//         {/*    customTextInputProps={customTextInputProps}*/}
//         {/*    maxLength={phone.phoneMask.length}*/}
//         {/*    placeholder={'Мобильный телефон'}*/}
//         {/*    value={phone.value}*/}
//         {/*    keyboardType={'phone-pad'}*/}
//         {/*    disabled={useCase.isBusy}*/}
//         {/*  />*/}
//         {/*  <InputTextErrors errors={phone.displayErrors} />*/}
//         {/*</VCol>*/}
//         <VCol flex justifyContent={'flex-end'}>
//           <VText mv={'lg_sm'} font={'body8'} color={colors.decorGray}>
//             Нажимая «Получить код», Вы подтверждаете:
//           </VText>
//           <VCheckBox mb={'lg_sm'} isChecked={useCase.personalDataAgreementAgree}
//             onPress={useCase.personalDataAgreementToggle}>
//             <VCheckBox.Component>
//               <VTouchable.Opacity onPress={this._openPersonalDataAgreementLink}>
//                 <VText ml={'md_sm'} font={'body8'} color={colors.positiveNormal}>
//                   Согласие на обработку персональных данных
//                 </VText>
//               </VTouchable.Opacity>
//             </VCheckBox.Component>
//           </VCheckBox>
//           <VText mb={'lg_sm'} font={'body8'} color={colors.decorGray}>
//             Принимаете условия:
//           </VText>
//           <VCheckBox mb={'lg_sm'} isChecked={useCase.edmAgreementAgree} onPress={useCase.edmAgreementToggle}>
//             <VCheckBox.Component>
//               <VTouchable.Opacity onPress={this._openEdmAgreementLink}>
//                 <VText ml={'md_sm'} font={'body8'} color={colors.positiveNormal}>
//                   Соглашения об электронном документообороте
//                 </VText>
//               </VTouchable.Opacity>
//             </VCheckBox.Component>
//           </VCheckBox>
//           <VCheckBox mb={'lg_sm'} isChecked={useCase.securityGuidelineAgree} onPress={useCase.securityGuidelineToggle}>
//             <VCheckBox.Component>
//               <VTouchable.Opacity onPress={this._openSecurityGuidelineLink}>
//                 <VText ml={'md_sm'} font={'body8'} color={colors.positiveNormal}>
//                   Рекомендации по информационной безопасности
//                 </VText>
//               </VTouchable.Opacity>
//             </VCheckBox.Component>
//           </VCheckBox>
//           <VButton.Fill onPress={useCase.phoneSet} disabled={!this._isValidForm} mt={20}>
//             Получить код
//           </VButton.Fill>
//         </VCol>
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
//         <VText mt={'xl_md'} font={'body8'} color={colors.decorGray} ta={'center'}>
//           На ваш номер телефона отправлено СМС с кодом подтверждения
//         </VText>
//         {/*<VCol flex alignItems={'center'} mt={'lg_sm'}>*/}
//         {/*  <InputText*/}
//         {/*    {...code.inputEvents}*/}
//         {/*    placeholder={'Код из SMS'}*/}
//         {/*    value={code.inputValue}*/}
//         {/*    keyboardType={'number-pad'}*/}
//         {/*    disabled={caseSignup.isBusy}*/}
//         {/*  />*/}
//         {/*  <InputTextErrors errors={code.displayErrors} />*/}
//         {/*  <Button.Link onPress={caseSignup.phoneSmsResend} disabled={!caseSignup.smsResendIsAllow} mt={'xl_md'}>*/}
//         {/*    {this.resendSmsTitle}*/}
//         {/*  </Button.Link>*/}
//         {/*</VCol>*/}
//         <VButton.Fill onPress={this.props.onConfirm} disabled={!code.isValid} mt={20}>
//           Подтвердить
//         </VButton.Fill>
//       </>
//     );
//   }
//
//   private _openPersonalDataAgreementLink = () => {
//     Linking.openURL(this.props.case.personalDataAgreementLink);
//   };
//
//   private _openEdmAgreementLink = () => {
//     Linking.openURL(this.props.case.edmAgreementLink);
//   };
//
//   private _openSecurityGuidelineLink = () => {
//     Linking.openURL(this.props.case.securityGuidelineLink);
//   };
// }

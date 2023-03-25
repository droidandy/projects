// import React from 'react';
// import { observer } from 'mobx-react';
// import { colors } from '_view/Theme';
// import { IDAuthSignupCase } from '@invest.wl/domain/src/Auth/case/D.AuthSignup.case';
// import { computed } from 'mobx';
// import { VButton, VCol, VText } from '@invest.wl/mobile';
//
// interface IAuthPasswordNewProps {
//   case: IDAuthSignupCase;
//   onConfirm(): void;
// }
//
// @observer
// export class AuthPasswordNew extends React.Component<IAuthPasswordNewProps> {
//   // private _const = IoC.get<ISEnvStore>(SEnvStoreTid);
//
//   @computed
//   private get _isFormValid() {
//     const { passwordField, passwordConfirmField } = this.props.case;
//     return passwordField.isValid && passwordConfirmField.isValid;
//   }
//
//   public render() {
//     // const { passwordField, passwordConfirmField, isBusy } = this.props.case;
//
//     return (
//       <VCol flex>
//         <VText mt={'xl_lg'} ta={'center'} font={'title3'} color={colors.baseContrast}>
//           Подтверждение пароля
//         </VText>
//         {/*<VText mt={'lg_sm'} ta={'center'} textStyle={'regular16x140'} color={colors.decorGray}>*/}
//         {/*  {this._const.authRecoveryDescription}*/}
//         {/*</VText>*/}
//
//         {/*<VInputField*/}
//         {/*  mt={20}*/}
//         {/*  error={passwordField.displayErrors}*/}
//         {/*  label={'Придумайте пароль'}*/}
//         {/*  type={'password'}>*/}
//         {/*  <VInputField.Input*/}
//         {/*    value={passwordField.value}*/}
//         {/*    onChangeText={passwordField.onChangeText}*/}
//         {/*    {...passwordField.inputEvents}*/}
//         {/*    editable={!isBusy}*/}
//         {/*  />*/}
//         {/*</VInputField>*/}
//
//         {/*<VInputField*/}
//         {/*  mt={20}*/}
//         {/*  error={passwordConfirmField.displayErrors}*/}
//         {/*  label={'Подтвердите пароль'}*/}
//         {/*  type={'password'}>*/}
//         {/*  <VInputField.Input*/}
//         {/*    value={passwordConfirmField.value}*/}
//         {/*    onChangeText={passwordConfirmField.onChangeText}*/}
//         {/*    {...passwordConfirmField.inputEvents}*/}
//         {/*    editable={!isBusy}*/}
//         {/*  />*/}
//         {/*</VInputField>*/}
//
//         <VCol flex />
//         <VButton.Fill onPress={this.props.onConfirm} disabled={!this._isFormValid} mt={20}>
//           Установить
//         </VButton.Fill>
//       </VCol>
//     );
//   }
// }

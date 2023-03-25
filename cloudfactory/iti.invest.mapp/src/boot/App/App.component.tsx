import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator, TransitionSpecs } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { AppPresentTid, IAppPresent } from './App.present';
import { VLayoutMainScreen } from '_view/Layout/screen/Main';
import { VLaunchScreen } from '_view/Layout/screen/Launch';
import { VLayoutManualScreen } from '_view/Layout/screen/Manual';
import { VWebViewScreen } from '_view/Layout/screen/WebView';
import { VAuthSignupScreen } from '_view/Auth/screen/Signup/V.AuthSignup.screen';
import { VAuthSmsConfirmScreen } from '_view/Auth/screen/SmsConfirm/V.AuthSmsConfirm.screen';
import { VAuthPasswordCreateScreen } from '_view/Auth/screen/PasswordCreate/V.AuthPasswordCreate.screen';
import { VAuthPasswordRestoreScreen } from '_view/Auth/screen/PasswordRestore/V.AuthPasswordRestore.screen';
import { EVAuthScreen } from '@invest.wl/view/src/Auth/V.Auth.types';
import { VLayoutOverlay } from '_view/Layout/component/V.LayoutOverlay.component';
import { EVSecurityScreen } from '@invest.wl/view/src/Security/V.Security.types';
import { EVOrderScreen } from '@invest.wl/view/src/Order/V.Order.types';
import { VOrderCreateScreen } from '_view/Order';
import { VLayoutEntryScreen } from '_view/Layout/screen/Entry';
import { VSecurityAccessBiometryScreen } from '_view/Security/screen/AccessBiometry/V.SecurityAccessBiometry.screen';
import { VSecurityUnlockScreen } from '_view/Security/screen/Unlock/V.SecurityUnlock.screen';
import { VSecurityAccessCodeScreen } from '_view/Security/screen/AccessCode/V.SecurityAccessCode.screen';
import { VAuthPasswordChangeScreen } from '_view/Auth/screen/PasswordChange/V.AuthPasswordChange.screen';
import { VSecuritySettingsScreen } from '_view/Security/screen/Settings/V.SecuritySettings.screen';
import { VLayoutMenuScreen } from '_view/Layout/screen/Menu/V.LayoutMenu.screen';
import { observer } from 'mobx-react';
import { EVLayoutScreen } from '@invest.wl/view/src/Layout/V.Layout.types';
import { ISRouterStore, SRouterStoreTid } from '@invest.wl/system/src/Router/S.Router.types';
import { VApplicationVersionUpdate } from '_view/Application/component/VersionUpdate';
import { EVPlaygroundScreen } from '_view/Playground/V.Playground.types';
import { VPlaygroundScreen } from '_view/Playground/screen/V.Playground.screen';
import { EVOwnerScreen } from '@invest.wl/view/src/Owner/V.Owner.types';
import { VOwnerTermsScreen } from '_view/Owner/screen/Terms/V.OwnerTerms.screen';
import { EVInstrumentScreen } from '@invest.wl/view/src/Instrument/V.Instrument.types';
import { VInstrumentExchangeScreen } from '_view/Instrument/screen/InstrumentExchange/V.InstrumentExchange.screen';
import { VInstrumentScreen, VInstrumentSearchScreen } from '_view/Instrument';
import { VLayoutInstrumentAlertTabs } from '_view/Layout/tabs/InstrumentAlert/V.LayoutInstrumentAlert.tabs';
import { VLayoutOperationTabs } from '_view/Layout/tabs/Operation';
import { VAuthExternalScreen } from '_view/Auth/screen/External/V.AuthExternal.screen';
import { ISAuthConfig, SAuthConfigTid } from '@invest.wl/system/src/Auth/S.Auth.types';
import { EDAuthStrategy } from '@invest.wl/core';
import { VAuthSigninCredScreen } from '_view/Auth/screen/SigninCred/V.AuthSigninCred.screen';
import { ISConfigStore, SConfigStoreTid } from '@invest.wl/system/src/Config/S.Config.types';
import { VAuthSigninScreen } from '_view/Auth/screen/Signin/V.AuthSignin.screen';
import { VApplicationExitConfirm } from '_view/Application/component/ExitConfirm';
import { VOperationDepositCreateScreen } from '_view/Operation/screen/V.OperationDepositCreate.screen';
import { EVOperationScreen } from "@invest.wl/view/src/Operation/V.Operation.types";

interface Props {
  onReady?: () => void;
}

const Stack = createStackNavigator();

@observer
export class App extends React.Component<Props> {
  private pr = IoC.get<IAppPresent>(AppPresentTid);
  private routerStore = IoC.get<ISRouterStore>(SRouterStoreTid);
  private authCfg = IoC.get<ISAuthConfig>(SAuthConfigTid);
  private cfg = IoC.get<ISConfigStore>(SConfigStoreTid);

  private nav?: NavigationContainerRef;

  public async componentDidMount() {
    // удаляем контейнер, чтобы небыло вызовов маршрутизации у не актуального контейнера
    this.routerStore.containerSet();
    try {
      await this.pr.init();
      this.props.onReady?.();
    } catch (e: any) {
      console.error(e);
    }
  }

  public render() {
    return (
      <SafeAreaProvider>
        <NavigationContainer onReady={this.navStart} ref={this.navRef}>
          <Stack.Navigator
            headerMode={'none'}
            screenOptions={{
              ...Platform.select({
                android: {
                  gestureDirection: 'vertical',
                  cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
                  transitionSpec: {
                    open: TransitionSpecs.FadeInFromBottomAndroidSpec,
                    close: TransitionSpecs.FadeOutToBottomAndroidSpec,
                  },
                },
              }),
            }}>

            {/* Launch screen must be first! */}
            <Stack.Screen name={EVLayoutScreen.LayoutLaunch} component={VLaunchScreen} />
            <Stack.Screen name={EVLayoutScreen.LayoutEntry} component={VLayoutEntryScreen} />
            <Stack.Screen name={EVLayoutScreen.LayoutManual} component={VLayoutManualScreen} />
            <Stack.Screen name={EVLayoutScreen.LayoutWebView} component={VWebViewScreen} />

            <Stack.Screen name={EVLayoutScreen.LayoutMenu} component={VLayoutMenuScreen} />
            <Stack.Screen name={EVLayoutScreen.LayoutMain} component={VLayoutMainScreen} />

            <Stack.Screen name={EVLayoutScreen.LayoutInstrumentAlertTabs} component={VLayoutInstrumentAlertTabs} />
            <Stack.Screen name={EVLayoutScreen.LayoutOperationTabs} component={VLayoutOperationTabs} />

            <Stack.Screen name={EVSecurityScreen.SecurityAccessCode} component={VSecurityAccessCodeScreen} />
            <Stack.Screen name={EVSecurityScreen.SecurityAccessBiometry} component={VSecurityAccessBiometryScreen} />
            <Stack.Screen name={EVSecurityScreen.SecurityUnlock} component={VSecurityUnlockScreen} />
            <Stack.Screen name={EVSecurityScreen.SecuritySettings} component={VSecuritySettingsScreen} />

            <Stack.Screen name={EVAuthScreen.AuthSignin}
              component={this.authCfg.strategy === EDAuthStrategy.Cred ? VAuthSigninCredScreen
                : this.cfg.systemConfigUrl.includes('rshb') ? VAuthSigninScreen : VAuthExternalScreen} />
            <Stack.Screen name={EVAuthScreen.AuthSignup} component={VAuthSignupScreen} />
            <Stack.Screen name={EVAuthScreen.AuthSmsConfirm} component={VAuthSmsConfirmScreen} />

            <Stack.Screen name={EVAuthScreen.AuthPasswordRestore} component={VAuthPasswordRestoreScreen} />
            <Stack.Screen name={EVAuthScreen.AuthPasswordCreate} component={VAuthPasswordCreateScreen} />
            <Stack.Screen name={EVAuthScreen.AuthPasswordChange} component={VAuthPasswordChangeScreen} />

            <Stack.Screen name={EVOwnerScreen.OwnerTerms} component={VOwnerTermsScreen} />

            <Stack.Screen name={EVOrderScreen.OrderCreate} component={VOrderCreateScreen} />

            <Stack.Screen name={EVInstrumentScreen.InstrumentExchange} component={VInstrumentExchangeScreen} />
            <Stack.Screen name={EVInstrumentScreen.Instrument} component={VInstrumentScreen} />
            <Stack.Screen name={EVInstrumentScreen.InstrumentSearch} component={VInstrumentSearchScreen} />


            <Stack.Screen name={EVPlaygroundScreen.Playground} component={VPlaygroundScreen} />

            <Stack.Screen name={EVOperationScreen.OperationDepositCreate} component={VOperationDepositCreateScreen} />
          </Stack.Navigator>
        </NavigationContainer>
        <VLayoutOverlay />
        <VApplicationVersionUpdate />
        <VApplicationExitConfirm />
      </SafeAreaProvider>
    );
  }

  private navRef = (nav: NavigationContainerRef) => {
    this.nav = nav;
  };

  private navStart = () => {
    if (!this.nav) return console.error('App component dont have nav');
    this.routerStore.containerSet(this.nav);
  };
}

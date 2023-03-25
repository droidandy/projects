import React from 'react';
import { Platform } from 'react-native';
import { reaction } from 'mobx';
import { CardStyleInterpolators, createStackNavigator, TransitionSpecs } from '@react-navigation/stack';
import { EVPortfelScreen } from '@invest.wl/view/src/Portfel/V.Portfel.types';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import { IVLayoutScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import { IoC } from '@invest.wl/core';
import { VPortfelStore, VPortfelStoreTid } from '@invest.wl/view/src/Portfel/V.Portfel.store';
import { observer } from 'mobx-react';
import { DisposableHolder } from '@invest.wl/common/src/util/disposable.util';
import { VPortfelInstrumentTypeScreen } from '../../../Portfel/screen/InstrumentType/V.PortfelInstrumentType.screen';
import { VPortfelScreen } from '../../../Portfel';

const Stack = createStackNavigator();

@mapScreenPropsToProps
@observer
export class VLayoutPortfelStack extends React.Component<IVLayoutScreenProps> {
  private _store = IoC.get<VPortfelStore>(VPortfelStoreTid);
  private _dH = new DisposableHolder();

  public componentDidMount() {
    this._dH.push(reaction(() => this.props.inFocus, inFocus => {
      if (!inFocus) this._store.currencySet(undefined);
    }));
  }

  public componentWillUnmount() {
    this._dH.dispose();
  }

  public render() {
    return (
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
        <Stack.Screen name={EVPortfelScreen.Portfel} component={VPortfelScreen} initialParams={this.props} />
        <Stack.Screen name={EVPortfelScreen.PortfelInstrumentType} component={VPortfelInstrumentTypeScreen}
          initialParams={this.props} />
      </Stack.Navigator>
    );
  }
}

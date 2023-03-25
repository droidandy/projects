import React from 'react';
import { Platform } from 'react-native';
import { CardStyleInterpolators, createStackNavigator, TransitionSpecs } from '@react-navigation/stack';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import { EVLayoutScreen, IVLayoutScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import { observer } from 'mobx-react';
import { VLayoutQuoteTabs } from '../../tabs/Quote/V.LayoutQuote.tabs';

const Stack = createStackNavigator();

@mapScreenPropsToProps
@observer
export class VLayoutInstrumentStack extends React.Component<IVLayoutScreenProps> {
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
        <Stack.Screen name={EVLayoutScreen.LayoutQuoteTabs} component={VLayoutQuoteTabs} />
      </Stack.Navigator>
    );
  }
}

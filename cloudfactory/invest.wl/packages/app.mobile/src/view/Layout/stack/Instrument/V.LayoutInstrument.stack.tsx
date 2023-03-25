import { mapScreenPropsToProps } from '@invest.wl/mobile';
import { EVLayoutScreen, IVLayoutScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import { CardStyleInterpolators, createStackNavigator, TransitionSpecs } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import React from 'react';
import { Platform } from 'react-native';
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

import React from 'react';
import { Platform } from "react-native";
import { CardStyleInterpolators, createStackNavigator, TransitionSpecs } from '@react-navigation/stack';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import { EVLayoutScreen, IVLayoutScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import { observer } from 'mobx-react';
import { EVApplicationScreen } from '@invest.wl/view/src/Application/V.Application.types';
import { VApplicationVersionScreen } from '../../../Application/screen/Version/V.ApplicationVersion.screen';
import { EVOwnerScreen } from '@invest.wl/view/src/Owner/V.Owner.types';
import { VOwnerContactScreen } from '../../../Owner/screen/Contact/V.OwnerContact.screen';
import { VOwnerInfoScreen } from '../../../Owner/screen/Info/V.OwnerInfo.screen';
import { EVCustomerScreen } from '@invest.wl/view/src/Customer/V.Customer.types';
import { VCustomerAccountSelfScreen } from '../../../Customer/screen/Self/V.CustomerAccountSelf.screen';
import { EVFeedbackScreen } from '@invest.wl/view/src/Feedback/V.Feedback.types';
import { VFeedbackReviewScreen } from '../../../Feedback/screen/Review/V.FeedbackReview.screen';
import { VLayoutMenuScreen } from '../../screen/Menu/V.LayoutMenu.screen';
import { VLayoutSettingsScreen } from '../../screen/Settings/V.LayoutSettings.screen';

const Stack = createStackNavigator();

@mapScreenPropsToProps
@observer
export class VLayoutProfileStack extends React.Component<IVLayoutScreenProps> {
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
        <Stack.Screen name={EVLayoutScreen.LayoutMenu} component={VLayoutMenuScreen} />
        <Stack.Screen name={EVApplicationScreen.ApplicationVersion} component={VApplicationVersionScreen} />
        <Stack.Screen name={EVOwnerScreen.OwnerContact} component={VOwnerContactScreen} />
        <Stack.Screen name={EVOwnerScreen.OwnerInfo} component={VOwnerInfoScreen} />
        <Stack.Screen name={EVCustomerScreen.CustomerAccountSelf} component={VCustomerAccountSelfScreen} />
        <Stack.Screen name={EVFeedbackScreen.FeedbackReview} component={VFeedbackReviewScreen} />
        <Stack.Screen name={EVLayoutScreen.LayoutSettings} component={VLayoutSettingsScreen} />
      </Stack.Navigator>
    );
  }
}

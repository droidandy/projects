import React from 'react';
import { Platform } from "react-native";
import { CardStyleInterpolators, createStackNavigator, TransitionSpecs } from '@react-navigation/stack';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import { IVLayoutScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import { observer } from 'mobx-react';
import { EVNewsScreen } from '@invest.wl/view/src/News/V.News.types';
import { VNewsListScreen, VNewsScreen } from '../../../News';
import { EVStoryScreen } from '@invest.wl/view/src/Story/V.Story.types';
import { VStoryListScreen, VStoryScreen } from '../../../Story';
import { EVInvestIdeaScreen } from '@invest.wl/view/src/InvestIdea/V.InvestIdea.types';
import { VInvestIdeaListScreen, VInvestIdeaScreen } from '../../../InvestIdea';

const Stack = createStackNavigator();

@mapScreenPropsToProps
@observer
export class VLayoutShowcaseStack extends React.Component<IVLayoutScreenProps> {
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
        <Stack.Screen name={EVInvestIdeaScreen.InvestIdeaList} component={VInvestIdeaListScreen} />
        <Stack.Screen name={EVInvestIdeaScreen.InvestIdea} component={VInvestIdeaScreen} />
        <Stack.Screen name={EVNewsScreen.News} component={VNewsScreen} />
        <Stack.Screen name={EVNewsScreen.NewsList} component={VNewsListScreen} />
        <Stack.Screen name={EVStoryScreen.Story} component={VStoryScreen} />
        <Stack.Screen name={EVStoryScreen.StoryList} component={VStoryListScreen} />
      </Stack.Navigator>
    );
  }
}

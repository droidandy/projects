import { NavigationState, PartialState, Route } from '@react-navigation/native';

export interface ISRoute extends Route<string> {
  state?: NavigationState | PartialState<NavigationState>;
}

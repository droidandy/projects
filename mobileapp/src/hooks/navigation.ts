import { useContext, useMemo } from 'react';
import { NavigationContext, NavigationRoute, NavigationScreenProp } from 'react-navigation';

export function useNavigation<Params>(): NavigationScreenProp<NavigationRoute, Params> {
  return useContext(NavigationContext) as NavigationScreenProp<NavigationRoute, Params>;
}

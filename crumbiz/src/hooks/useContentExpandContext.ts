import React from 'react';
import { useContext } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import { DynamicObject } from '../types/interfaces';
import { ScreensEnum } from '../navigation/screens';
import { TargetProfileContext as TargetProfile } from '../screens/OppOverview/targetProfileContext';
import { SubcontentOpenContext as OppCrumbContext } from '../screens/OppOverview/SubcontentOpenContext';

type mapperType = DynamicObject<React.Context<any>>;

// Todo Sason - why ScreensEnum is null when using plain object
const routeContextMapper = () => {
  const mapper : mapperType = {
    [ScreensEnum.TARGET_PROFILE]: TargetProfile,
    [ScreensEnum.OPP_CRUMB]: OppCrumbContext,
  };

  return mapper;
}

const useContentExpandContext = () => {

  const { state } = useNavigation();
  const route = state.routeName;
  return useContext(routeContextMapper()[route]);
};

export default useContentExpandContext;

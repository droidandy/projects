import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDashboardPlatform } from 'actions/settings';
import CustomMultiSelect from 'components/CustomMultiSelect/CustomMultiSelect';
import { getDashboardPlatformMultiSelectValue } from '../../selectors';
import { isApplicationCrossplatform } from 'selectors/application';
import {track} from "../../../../../libs/helpers";

const options = [
  { name: 'iOS', value: 'ios' },
  { name: 'Android', value: 'android' },
];

const PlatformSwitcher = () => {
  const isCrossplatform = useSelector(isApplicationCrossplatform);
  const value = useSelector(getDashboardPlatformMultiSelectValue);
  const dispatch = useDispatch();

  useEffect(() => {
    if(!isCrossplatform) {
      dispatch(setDashboardPlatform(null));
    }
  },[isCrossplatform])


  const handleOnChange = (values) => {
    if (values.length === 0 || values.length === 2) {
      dispatch(setDashboardPlatform(null));
      return;
    }
    dispatch(setDashboardPlatform(values[0]));
    track("dashboard_platform_selected", values[0]);
  };

  if(!isCrossplatform) {
    return null;
  }

  return (
    <CustomMultiSelect
      values={value}
      options={options}
      onChange={handleOnChange}
      className="custom-select_apps"
      id="timezone"
      labelKey="name"
      valueKey="value"
    ></CustomMultiSelect>
  );
};

export default PlatformSwitcher;

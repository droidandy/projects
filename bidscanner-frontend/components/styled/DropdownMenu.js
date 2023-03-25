import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
// import SelectField from 'material-ui/SelectField';

const rootStyle = {
  height: '24px',
};

const labelStyle = {
  height: '24px',
  lineHeight: '24px',
  paddingLeft: 0,
  paddingRight: '24px',
};

const iconStyle = {
  padding: 0,
  width: '24px',
  height: '24px',
  fill: '#000',
  right: 0,
  top: 0,
};

const menuStyle = {
  boxShadow: 'none',
  // border: '1px solid #E1E1E1',
  borderRadius: '4px',
};

const selectedMenuItemStyle = {
  color: '#74bbe7',
};

const underlineStyle = {
  display: 'none',
};

export default props =>
  <DropDownMenu
    {...props}
    underlineStyle={underlineStyle}
    // underlineFocusStyle={underlineStyle}
    // underlineDisabledStyle={underlineStyle}
    style={rootStyle}
    labelStyle={labelStyle}
    iconStyle={iconStyle}
    selectedMenuItemStyle={selectedMenuItemStyle}
    menuStyle={menuStyle}
  />;

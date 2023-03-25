import React from 'react';
import MediaQuery from 'react-responsive';

export const sidebarMenuBreakPoint = 1024;

export function SidebarMedia(props) {
  return <MediaQuery { ...props } maxWidth={ sidebarMenuBreakPoint } />;
}

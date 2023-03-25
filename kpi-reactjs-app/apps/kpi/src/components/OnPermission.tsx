import { Permission } from 'src/types';
// import { getGlobalState } from 'src/features/global/interface';
import React from 'react';
// import styled from 'styled-components';
// import { Trans } from 'react-i18next';

interface OnPermissionProps {
  children: React.ReactNode;
  permission: Permission | Permission[];
  showError?: boolean;
}

// const Center = styled.div`
//   text-align: center;
//   margin-top: 30px;
// `;

export function OnPermission(props: OnPermissionProps) {
  const { children } = props;
  return children as any;

  // const { children, permission, showError } = props;
  // const { permissionMap } = getGlobalState.useState();
  // const permissions = Array.isArray(permission) ? permission : [permission];
  // if (permissions.some(x => !!permissionMap[x])) {
  //   return children as any;
  // }
  // if (showError) {
  //   return (
  //     <Center>
  //       <Trans>You don't have permission to access this page</Trans>
  //     </Center>
  //   );
  // }
  // return null;
}

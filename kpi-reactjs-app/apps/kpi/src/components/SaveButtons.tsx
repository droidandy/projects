import * as React from 'react';
import styled from 'styled-components';
import { rtlMargin } from 'shared/rtl';
import { Link } from 'typeless-router';
import { Button } from './Button';
import { Trans } from 'react-i18next';
import { Popconfirm } from './Popconfirm';
import { Permission } from 'src/types';
import { getGlobalState } from 'src/features/global/interface';

interface SaveButtonsProps {
  className?: string;
  onSave: () => any;
  onDelete?: () => any;
  onCancel?: string | (() => any);
  isSaving?: boolean;
  isDeleting?: boolean;
  isSaveDisabled?: boolean;
  showDelete?: boolean;
  deletePermission?: Permission;
  savePermission?: Permission;
  hideSave?: boolean;
}

const _SaveButtons = (props: SaveButtonsProps) => {
  const {
    className,
    onSave,
    onCancel,
    isSaving,
    showDelete,
    isDeleting,
    onDelete,
    deletePermission,
    savePermission,
    hideSave,
    isSaveDisabled,
  } = props;
  const { permissionMap } = getGlobalState.useState();

  const cancelButton = (
    <Button
      styling="brand"
      onClick={typeof onCancel === 'function' ? onCancel : undefined}
    >
      <Trans>Cancel</Trans>
    </Button>
  );
  return (
    <div className={className}>
      {showDelete && (!deletePermission || permissionMap[deletePermission]) && (
        <Popconfirm text="Are you sure to delete?" onYes={onDelete!}>
          <Button styling="secondary" loading={isDeleting}>
            <Trans>Delete</Trans>
          </Button>
        </Popconfirm>
      )}
      {onCancel &&
        (typeof onCancel === 'string' ? (
          <Link href={onCancel}>{cancelButton}</Link>
        ) : (
          cancelButton
        ))}
      {(!savePermission || permissionMap[savePermission]) && !hideSave && (
        <Button disabled={isSaveDisabled} onClick={onSave} loading={isSaving}>
          <Trans>Save</Trans>
        </Button>
      )}
    </div>
  );
};

export const SaveButtons = styled(_SaveButtons)`
  display: flex;
  margin-top: 20px;
  justify-content: flex-end;
  > * + * {
    ${rtlMargin('15px', 0)}
  }
`;

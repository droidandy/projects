import React from "react";
import PermissionGroup from "./PermissionGroup";

export default function EditPermissionGroup({ initData, onSuccess, ...rest }) {
    return <PermissionGroup
        label="Edit permission group"
        successText="Update group"
        initData={initData}
        onSuccess={(data) => onSuccess(data, initData.id)}
        {...rest}
    />
}

import React from "react";
import styles from "./index.module.scss";
import {ReactComponent as Actions} from "./assets/actions.svg";
import Popover from "./Popover";
import PopoverMenuItem from "./PopoverMenuItem";
import {icons} from "./IconChooser";
import {ReactComponent as RemoveIcon } from "./assets/remove.svg";
import {ReactComponent as EditIcon } from "./assets/edit.svg";


export default function PermissionGroup({ data, onEdit, onRemove, hideRemove = false }) {
    const { icon, name } = data;
    const iconSource = icons[icon || 0];
    return <div className={styles.permissionGroup}>
        <div className={styles.icon}>
            {iconSource && <img src={iconSource} /> }
        </div>
        <div className={styles.content}>
            <label>{name}</label>
        </div>
        <div className={styles.actions}>
            <Popover label={<Actions />}>
                <PopoverMenuItem label={<><EditIcon/>&nbsp;Edit</>} onClick={() => onEdit(data)}/>
                { !hideRemove
                    && <PopoverMenuItem color="red" label={<><RemoveIcon/>&nbsp;Remove group</>}  onClick={() => onRemove(data)} />
                }
            </Popover>
        </div>
    </div>
}

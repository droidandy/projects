import React from "react";
import styles from "../index.module.scss";
import {ReactComponent as Actions} from "../assets/actions2.svg";
import Popover from "../Popover";
import PopoverMenuItem from "../PopoverMenuItem";

import {ReactComponent as RemoveIcon } from "../assets/remove.svg";
import {ReactComponent as EditIcon } from "../assets/edit.svg";
import {ReactComponent as DragIcon } from "../assets/drag.svg";


export default function Product({ data, onEdit, onRemove, isLast = false }) {
    return <div className={styles.product}>
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <DragIcon />
                &nbsp;
                <span className={styles.label}>
                    {data?.name}
                </span>
            </div>
            <div className={styles.actions}>
                <Popover label={<Actions />} position={isLast ? "top" : "bottom"} height={50}>
                    <PopoverMenuItem color="red" label={<><RemoveIcon/>&nbsp;Remove product</>} onClick={() => onRemove(data)} />
                </Popover>
            </div>
        </div>
    </div>
}

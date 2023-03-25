import React from "react";
import styles from "./index.module.scss";
import {ReactComponent as Actions} from "./assets/actions2.svg";
import {ReactComponent as AndroidIcon} from "./assets/android.svg";
import {ReactComponent as IOSIcon} from "./assets/apple.svg";
import Popover from "./Popover";
import PopoverMenuItem from "./PopoverMenuItem";

import {ReactComponent as RemoveIcon } from "./assets/remove.svg";
import {ReactComponent as EditIcon } from "./assets/edit.svg";
import {ReactComponent as MoveIcon } from "./assets/move.svg";
import {truncate} from "./utils";

export default function Product({ data, onEdit, onRemove, onMove }) {
    const { name, products = [] } = data;
    return <div className={styles.product}>
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <label>{name}</label>
            </div>
            <div className={styles.actions}>
                <Popover label={<Actions />}>
                    <PopoverMenuItem label={<><EditIcon/>&nbsp;Edit</>} onClick={() => onEdit(data)} />
                    <PopoverMenuItem label={<><MoveIcon/>&nbsp;Move to group</>} onClick={() => onMove(data)}/>
                    <PopoverMenuItem color="red" label={<><RemoveIcon/>&nbsp;Remove product</>} onClick={() => onRemove(data)} />
                </Popover>
            </div>
        </div>
        <div className={styles.appList}>
            {products.map((app, key) => (
                <div className={styles.appItem} key={key}>
                    {app.store === "app_store" && <IOSIcon />}
                    {app.store === "play_store" && <AndroidIcon />}
                    {truncate(app.product_id)}
                </div>
            ))}
        </div>
    </div>
}

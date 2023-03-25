import React from "react";
import styles from "./index.module.scss";
import { ReactComponent as Icon } from "./assets/warning.svg";
import Popover from "./Popover";
import {ReactComponent as Actions} from "./assets/actions2.svg";
import PopoverMenuItem from "./PopoverMenuItem";
import {ReactComponent as EditIcon} from "./assets/edit.svg";
import {ReactComponent as MoveIcon} from "./assets/move.svg";
import {ReactComponent as RemoveIcon} from "./assets/remove.svg";
import {ReactComponent as IOSIcon} from "./assets/apple.svg";
import {ReactComponent as AndroidIcon} from "./assets/android.svg";
import Tip from "../../containers/Common/Tip";
import {truncate} from "./utils";

export default function UnCategorizedProducts({ data, onEdit, onMove, onRemove }) {
    const found = data.find((e) => e?.products.length > 0);
    return (
        <>
            { found
                && <div className={styles.uncategorized}>
                    <div className={styles.label}>
                        <Icon />
                        Uncategorized Product IDs
                        <div className={styles.tip}>
                            <Tip width={523} description={
                                <p>
                                    Move uncategorized Product IDs into Products. This will allow you to change Products without app updates and run price experiments.
                                    <br /><br />
                                    It’s strongly recommended! Do not hard-code Product IDs within your apps – use the power of Products instead!
                                </p>
                            } />
                        </div>
                    </div>
                    <div className={styles.items}>
                        { data.map((group) => {
                            return group.products.map((el, key) => (
                                <div className={styles.product} key={key}>
                                    <div className={styles.wrapper}>
                                        <div className={styles.content}>
                                            <div className={styles.appItem}>
                                                {el.store === "app_store" && <IOSIcon />}
                                                {el.store === "play_store" && <AndroidIcon />}
                                                {truncate(el.product_id)}
                                            </div>
                                        </div>
                                        <div className={styles.actions}>
                                            <Popover label={<Actions />}>
                                                <PopoverMenuItem
                                                    label={<><EditIcon/>&nbsp;Edit</>}
                                                    onClick={() => onEdit(el)}
                                                />
                                                <PopoverMenuItem
                                                    label={<><MoveIcon/>&nbsp;Move to product</>}
                                                    onClick={() => onMove(el)}
                                                />
                                                <PopoverMenuItem
                                                    color="red"
                                                    label={<><RemoveIcon/>&nbsp;Remove product</>}
                                                    onClick={() => onRemove(el)}
                                                />
                                            </Popover>
                                        </div>
                                    </div>
                                </div>
                            ))
                        })}
                    </div>
                </div>
            }
        </>
    )
}

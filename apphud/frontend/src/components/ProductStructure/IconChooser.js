import React from "react";
import icon1 from "./assets/icons/1.svg"
import icon2 from "./assets/icons/2.svg"
import icon3 from "./assets/icons/3.svg"
import icon4 from "./assets/icons/4.svg"
import icon5 from "./assets/icons/5.svg"
import icon6 from "./assets/icons/6.svg"
import icon7 from "./assets/icons/7.svg"
import styles from "./index.module.scss";

export const icons = [icon1, icon2, icon3, icon4, icon5, icon6, icon7];

export default function IconChooser(props) {
    const { value, onChange } = props;
    return (
        <>
            <div className={styles.iconChooserLabel}>
                Group’s Icon
            </div>
            <div className={styles.iconChooser}>
                {icons.map((icon, key) => (
                    <div className={`${styles.icon} ${Number(value) === key && styles.active}`} key={key} onClick={() => onChange(icon, key)}>
                        <img src={icon} />
                    </div>
                ))}
            </div>
        </>
    )
}

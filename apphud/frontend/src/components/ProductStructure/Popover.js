import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";

export default function Popover({ label, children, position = "bottom", height = null }) {
    const [isOpen, setIsOpen] = useState(false);
    const eventListener = () => {
        setTimeout(() => setIsOpen(false), 0);
    }
    useEffect(() => {
        if (isOpen) {
            window.document.body.addEventListener("click", eventListener);
        }
        return () => {
            window.document.body.removeEventListener("click", eventListener);
        }
    }, [isOpen]);
    const style = position === "top" && height !== null ? { top: `-${height}px`} : {};
    return <div className={`${styles.popover} ${styles[`${position}`]}`}>
        <a className={styles.link} onClick={() => setIsOpen(!isOpen)}>
            {label}
        </a>
        { isOpen
            && <div className={styles.wrapper} style={style}>
                {children}
            </div>
        }
    </div>
}

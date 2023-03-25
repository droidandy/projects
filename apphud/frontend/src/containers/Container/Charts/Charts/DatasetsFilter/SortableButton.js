import React, { useState, useEffect } from "react";
import styles from "./SortableButton.module.scss";

export default function SortableButton({ children, onChange, value = 0 }) {
    const [order, setOrder] = useState(0);
    const direction = order === 0 ? "default" : order === -1 ? "up" : "down";
    const onClickHandler = () => {
        const result = order === 0 ? -1 : order * -1;
        setOrder(result);
        onChange(result);
    };
    useEffect(() => {
        setOrder(value);
    }, [value])
    return (
      <div className={`${styles.root} ${order !== 0 && styles.active}`} onClick={onClickHandler}>
        { children }
        <span className={`${styles.button} ${styles[direction]}`} />
      </div>
    );
}

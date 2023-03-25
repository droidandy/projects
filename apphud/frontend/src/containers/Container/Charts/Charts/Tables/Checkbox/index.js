import React from "react";
import cn from "classnames";
import styles from "./styles.module.scss";
import colors from "../../utils/colors";

const Checkbox = ({ checked, children, id, title, onChange, hasChild, color }) => {
  return (
    <div className={`${styles.checkbox} ${styles[`hex-${colors.indexOf(color)+1}`]}`}>
      <input
        value="none"
        type="checkbox"
        name="check"
        checked={checked}
        onChange={onChange}
        id={id}
      />
      <label htmlFor={id} title={title} className={cn({ _minus: hasChild })} >
        {children}
      </label>
    </div>
  );
};

export default Checkbox;

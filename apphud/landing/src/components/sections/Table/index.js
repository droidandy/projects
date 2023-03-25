import React from "react";
import cn from "classnames";
import styles from "./styles.module.scss";

const Table = ({ titles, items, col3, children, className }) => {
  return (
    <div className={cn(styles.table, className)}>
      <div className="container">
        <div className={styles.grid}>
          <div className={cn(styles.header, { col3: col3 })}>
            {titles?.map((e, i) => (
              <p key={i}>
                {e.description}
                {e.subescription && <span>{e.subescription}</span>}
              </p>
            ))}
          </div>
          {items?.map((e, i) => (
            <div className={cn(styles.item, { col3: col3 })} key={i}>
              <p>{e.description}</p>

              {e.col1Text && <span>{e.col1Text}</span>}
              {e.col1Check && <img src={`/icons/${e.col1Check}.svg`} />}
              {e.col1Close && <img src={`/icons/${e.col1Close}.svg`} />}

              {e.col2Text && <span>{e.col2Text}</span>}
              {e.col2Check && <img src={`/icons/${e.col2Check}.svg`} />}
              {e.col2Close && <img src={`/icons/${e.col2Close}.svg`} />}

              {e.col3Text && <span>{e.col3Text}</span>}
              {e.col3Check && <img src={`/icons/${e.col3Check}.svg`} />}
              {e.col3Close && <img src={`/icons/${e.col3Close}.svg`} />}
            </div>
          ))}
        </div>
        <div className={cn(styles.header, { col3: col3 })}>{children}</div>
      </div>
    </div>
  );
};

export default Table;

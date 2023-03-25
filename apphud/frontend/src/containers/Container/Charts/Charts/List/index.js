import React, { Fragment } from "react";
import {NavLink, useLocation} from "react-router-dom";
import styles from "./styles.module.scss";
import ChartInfo from "../ChartInfo";

const Link = ({children, ...props}) => {
  return (
    <NavLink
      className={styles.item}
      activeClassName="_active"
      {...props}
    >
      {children}
    </NavLink>
  );
}

const List = ({ list, onResetFilter, chartId, user, subRoute = "charts", withName = true  }) => {
  const location = useLocation();
  return (
    <div className={styles.sidebar}>
      {list?.map((item, index) => {
        return (
          <Fragment key={index}>
            {withName && (<div className={styles.title}>{item.name}</div>)}
            {item.charts.map((el, i) => {
              const appId = location.pathname.split("/")[2];
              return (
                <Link
                  key={`sidebar_${i}`}
                  to={`/apps/${appId}/${subRoute}/${el.id}`}
                  onClick={() => {
                    onResetFilter(el.id);
                  }}
                >
                  {ChartInfo[el?.id]?.label || el.short_name}
                </Link>
              )
            })}
          </Fragment>
        )
      })}
    </div>
  );
};

export default List;

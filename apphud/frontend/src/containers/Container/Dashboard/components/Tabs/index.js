import React from "react";
import styles from "./index.module.scss";
import {Link, NavLink} from "react-router-dom";
import {useRouteMatch} from "react-router";
import { ReactComponent as Icon1 } from "../../assets/graph_bar-16.svg"
import { ReactComponent as Icon2 } from "../../assets/horizontal_funnel-16.svg"

export default function Tabs() {
    let { url } = useRouteMatch();
    return <div className={styles.root}>
        <NavLink to={`${url}`} className={styles.tab} activeClassName={styles.active} strict exact>
            <Icon1 className={styles.icon} />
            Key metrics
        </NavLink>
        <NavLink to={`${url}/conversions`} className={styles.tab} activeClassName={styles.active} strict exact>
            <Icon2 className={styles.icon} />
            Conversions
        </NavLink>
    </div>
}

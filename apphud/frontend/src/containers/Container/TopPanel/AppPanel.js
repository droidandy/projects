import React from "react";
import styles from "./AppPanel.module.scss";
import { ReactComponent as BackIcon } from "./back.svg";
import {connect} from "react-redux";
import TokenService from "../../../libs/TokenService";

function AppPanel(props) {
    const found = TokenService.getSwitchUserToken();
    return <>
        { found
            && <div className={styles.root}>
                <a className={styles.button} href="/">
                    <BackIcon />
                </a>
                <span className={styles.title}>{props.application?.name}</span>
            </div>
        }
    </>
}

export default connect((state) => ({
    application: state.application,
    applications: state.applications
}))(AppPanel);

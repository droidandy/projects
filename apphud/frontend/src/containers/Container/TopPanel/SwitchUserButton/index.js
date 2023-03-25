import React from "react";
import axios from "axios";
import {connect} from "react-redux";

function SwitchUserButton({ application, applications }) {
    const found = applications.find((app) => app.id === application?.id);
    const onClickHandler = () => {
        axios.get(`/su/token?app_uid=${application?.id}`).then(({ data }) => {
            const { results } = data?.data;
            window.location.href =  `${window.location.pathname}?t=${results?.token}`
        })
    };
    return <>
        { !found
            && <a
                onClick={onClickHandler}
                className="link container-top__panel-link">
                View as user
            </a>
        }
    </>
}

export default connect((state) => ({
    application: state.application,
    applications: state.applications
}))(SwitchUserButton);

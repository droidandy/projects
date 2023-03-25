import React from "react";
import PropTypes from "prop-types";

export default function Switch({ checked, title, onChange }) {
    return <label className="switcher switcher_green">
        <input
            id="viewSandbox"
            onChange={onChange}
            checked={checked}
            type="checkbox"
            className="ios-switch green"
        />
        <div>
            <div />
        </div>
        <span className="switcher-title">{title}</span>
    </label>
}

Switch.propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func
}

Switch.defaultProps = {
    checked: false,
    title: "",
    onChange: () => {}
}

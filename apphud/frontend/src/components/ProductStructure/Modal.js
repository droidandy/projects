import React from "react";
import BaseModal from "react-modal";
import styles from "./index.module.scss"

const style = {
    content: {
        position: "relative",
        margin: "auto",
        padding: 24,
        borderRadius: 8,
        width: 410,
        overlfow: "visible"
    },
    overlay: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    h1: {
        color: "#1A344B",
        fontSize: 28,
        paddingBottom: 14
    }
}

export default function Modal(props) {
    const { children, onCancel, onSuccess, label, cancelText, successText, visible, loading = false, color = "green" } = props;
    return <BaseModal
        style={style}
        isOpen={visible}
        className="ReactModal__Content ReactModal__Content-visible"
        ariaHideApp={false}
        shouldFocusAfterRender={false}
        contentLabel={label}>
        <form>
            <h1 style={style.h1}>{label}</h1>
            <div style={{paddingBottom: 24}} className={styles.modal}>{
                children
            }</div>
            <div style={{display:"flex"}}>
                <button className="button button_grey fl" style={{flex:1, marginRight: 10}} onClick={(e) => {
                    e.preventDefault();
                    onCancel(e);
                }}>
                    <span>{cancelText}</span>
                </button>
                <button className={`button button_${color} fr`} style={{flex:1, marginLeft: 10}} onClick={(e) => {
                    e.preventDefault();
                    onSuccess(e);
                }} disabled={loading}>
                    <span>{successText}</span>
                </button>
            </div>
        </form>
    </BaseModal>
}

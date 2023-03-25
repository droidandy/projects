import React, {useState, useEffect} from "react";
import Modal from "../Modal";
import styles from "../index.module.scss";
import Select from "../../../containers/Container/Charts/Charts/Filter/Select";
import Input from "../../Input";
import {ReactComponent as IOSIcon} from "../assets/apple.svg";
import {ReactComponent as AndroidIcon} from "../assets/android.svg";

export default function EditProductId(props) {
    const {
        initData = {},
        groups = [],
        onCancel,
        onSuccess,
        loading ,
        label = "Edit product id",
        cancelText = "Cancel",
        successText = "Save"
    } = props;
    const [state, setState] = useState({});
    const onChangeHandler = (key, val) => setState({
        ...state,
        [key]: val
    })
    useEffect(() => {
        setState(initData);
    }, []);
    return <>
        <Modal
            loading={loading}
            visible={true}
            label={label}
            cancelText={cancelText}
            successText={successText}
            onCancel={() => {
                setState(initData);
                onCancel();
            }}
            onSuccess={() => {
                onSuccess({
                    ...initData,
                    ...state
                });
            }}>
            <Input
                className={styles.input}
                icon={state.store === "app_store" ? <IOSIcon /> : <AndroidIcon />}
                label='Product ID'
                type='text'
                required={true}
                value={state?.product_id}
                onChange={(e) => onChangeHandler("product_id",  e?.value)}
                placeholder={state.store === "play_store" ? "iOS product ID" : "Android product ID"}
            />
        </Modal>
    </>
}


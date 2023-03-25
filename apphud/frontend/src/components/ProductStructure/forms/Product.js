import React, {useState, useEffect} from "react";
import Input from "../../Input";
import Modal from "../Modal";
import {ReactComponent as AndroidIcon} from "../assets/android.svg";
import {ReactComponent as IOSIcon} from "../assets/apple.svg";
import styles from "../index.module.scss";
import Select from "../../../containers/Container/Charts/Charts/Filter/Select";

export default function Product(props) {
    const {
        initData = {},
        groups = [],
        onCancel,
        onSuccess,
        loading ,
        label = "Add product",
        cancelText = "Cancel",
        successText = "Add product",
        mode = "create",
    } = props;
    const [state, setState] = useState({});
    const [valid, setValid] = useState(false);
    const onChangeHandler = (key, val) => setState({
        ...state,
        [key]: val
    })
    useEffect(() => {
        setState(initData);
    }, [])
    useEffect(() => {
        const name = state?.name?.length > 0;
        const apps = state?.app_store_product_id?.length > 0 || state?.play_store_product_id?.length > 0;
        setValid(name && apps);
    }, [state]);
    return <>
        <Modal
            loading={loading || !valid}
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
                label='Product name'
                type='text'
                required={true}
                value={state?.name}
                onChange={(e) => onChangeHandler("name",  e?.value)}
                placeholder="Product name"
            /><br/>
            <div className={styles.iconChooserLabel}>Permission Group</div>
            <Select
                defaultValue={groups.find((el) => el.value === initData?.group_id)}
                options={groups}
                onChange={(e) => onChangeHandler("group_id",  e?.value)}
                isSearchable={false}
                autoFocus={false}
                clearable={false}
            /><br/>
            <Input
                className={styles.input}
                icon={<IOSIcon />}
                label='Product ID'
                type='text'
                required={true}
                disabled={mode === "move"}
                value={state?.app_store_product_id}
                onChange={(e) => onChangeHandler("app_store_product_id",  e?.value)}
                placeholder="iOS product ID"
            />
            <Input
                className={styles.input}
                icon={<AndroidIcon />}
                type='text'
                required={true}
                disabled={mode === "move"}
                value={state?.play_store_product_id}
                onChange={(e) => onChangeHandler("play_store_product_id",  e?.value)}
                placeholder="Android product ID"
            />
        </Modal>
    </>
}

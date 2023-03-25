import React, {useState, useEffect} from "react";
import Modal from "../Modal";
import styles from "../index.module.scss";
import Select from "../../../containers/Container/Charts/Charts/Filter/Select";

export default function MoveProduct(props) {
    const {
        initData = {},
        groups = [],
        onCancel,
        onSuccess,
        loading ,
        label = "Move product",
        cancelText = "Cancel",
        successText = "Move product"
    } = props;
    const [state, setState] = useState({});
    const onChangeHandler = (key, val) => setState({
        ...state,
        [key]: val
    })
    useEffect(() => {
        setState(initData);
    }, [])
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

            <div className={styles.iconChooserLabel}>Move Product to Move to Permission Groups</div>
            <Select
                defaultValue={groups.find((el) => el.value === initData?.group_id)}
                options={groups}
                onChange={(e) => onChangeHandler("group_id",  e?.value)}
                isSearchable={false}
                autoFocus={false}
                clearable={false}
            />
        </Modal>
    </>
}


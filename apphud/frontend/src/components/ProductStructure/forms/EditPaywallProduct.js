import React, {useState, useEffect} from "react";
import Input from "../../Input";
import Modal from "../Modal";
import styles from "../index.module.scss";
import TextArea from "../../TextArea/TextArea";
import Select from "../../../containers/Container/Charts/Charts/Filter/Select";

export default function EditPaywallProduct(props) {
    const {
        initData,
        onCancel,
        onSuccess,
        products = [],
        loading = false,
        label = "Edit product",
        cancelText = "Cancel",
        successText = "Update product"
    } = props;
    const [state, setState] = useState({});
    const [valid, setValid] = useState(false);
    const onChangeHandler = (key, val) => {
        setState({
            ...state,
            [key]: val
        })
    }
    useEffect(() => {
        setState(initData);
    }, [])
    useEffect(() => {
        setValid( state?.product_bundle_id?.length > 0);
    }, [state]);
    return (
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
                onSuccess(state);
            }}>
            <div className={`${styles.iconChooserLabel} Input_required__15bDt`}>Select Product</div>
            <Select
                defaultValue={products.find((el) => el.value === initData?.product_bundle_id)}
                options={products.map(e => ({ label: e.name, value: e.id }))}
                onChange={(e) => onChangeHandler("product_bundle_id",  e?.value)}
                isSearchable={false}
                autoFocus={false}
                clearable={false}
                placeholder="Product"
            />
        </Modal>
    )
}

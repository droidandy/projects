import React, {useState, useEffect} from "react";
import Modal from "../Modal";
import styles from "../index.module.scss";
import Select from "../../../containers/Container/Charts/Charts/Filter/Select";

export default function MoveProductId(props) {
    const {
        initData = {},
        groups = [],
        onCancel,
        onSuccess,
        loading ,
        label = "Move product id",
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
    let data = [];
    for(const g of groups) {
        data = data.concat(g.product_bundles.map((p) => ({ label: p.name, value: p.id })));
    }
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

            <div className={styles.iconChooserLabel}>Move Product ID to Product</div>
            <Select
                defaultValue={groups.find((el) => el.value === initData?.product_id)}
                options={data}
                onChange={(e) => onChangeHandler("product_bundle_id",  e?.value)}
                isSearchable={false}
                autoFocus={false}
                clearable={false}
                placeholder="Select product"
                bottomText={"If destination product already contains a product ID, old product ID will be moved to “Uncategorized product IDs” section."}
            />
        </Modal>
    </>
}


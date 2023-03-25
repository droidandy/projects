import React, {useState, useEffect} from "react";
import Input from "../../Input";
import Modal from "../Modal";
import styles from "../index.module.scss";
import TextArea from "../../TextArea/TextArea";

export const PaywallConfigTypes = {
  create: "create_paywall",
  edit: "edit_paywall"
}

export default function PaywallConfig(props) {
    const {
        type = PaywallConfigTypes.create,
        initData,
        onCancel,
        onSuccess,
        loading = false,
        label = "Create paywall",
        cancelText = "Cancel",
        successText = "Save"
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
        const name = state?.name?.length > 0;
        const apps = state?.identifier?.length > 0;
        setValid(name && apps);
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
            <Input
                className={styles.input}
                label='Paywall name'
                type='text'
                required={true}
                value={state?.name}
                onChange={(e) => onChangeHandler("name",  e?.value)}
                placeholder="Paywall name"
                bottomText="Only english letters, numbers, space, underline and dash. Length is up to 20 symbols."
            /><br/>
            <Input
                disabled={type === PaywallConfigTypes.edit}
                className={styles.input}
                label='Paywall identifier'
                type='text'
                required={true}
                value={state?.identifier}
                onChange={(e) => onChangeHandler("identifier",  e?.value)}
                placeholder="Paywall identifier"
                bottomText="Only english letters, numbers, underline and dash. Length is up to 20 symbols."
            />
            <TextArea
                label='Custom JSON'
                placeholder="Мax 4000 characters"
                value={state?.json}
                onChange={(e) => onChangeHandler("json",  e?.value)}
                required={false}
                rows={4}
            />
        </Modal>
    )
}

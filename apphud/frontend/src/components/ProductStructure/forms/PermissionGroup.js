import React, {useState, useEffect} from "react";
import Input from "../../Input";
import IconChooser from "../IconChooser";
import Modal from "../Modal";

export default function PermissionGroup(props) {
    const {
        initData,
        onCancel,
        onSuccess,
        loading = false,
        label = "Create permission group",
        cancelText = "Cancel",
        successText = "Add group"
    } = props;
    const [state, setState] = useState({ icon: 0 });
    const [valid, setValid] = useState(initData?.name.length > 0);
    const onChangeHandler = (key, val) => {
        setState({
            ...state,
            [key]: val
        })
    }
    useEffect(() => {
        setState({ ...state, ...initData });
    }, [])
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
                label='Product permission name'
                type='text'
                required={true}
                value={state?.name}
                onChange={(e) => {
                    setValid(e?.value.trim().length > 0);
                    onChangeHandler("name",  e?.value)
                }}
                placeholder="Product permission name"
                bottomText={"Only english letters, numbers, space, underline and dash. Length is up to 20 symbols."}
            />
            <br />
            <IconChooser value={state?.icon} onChange={(icon, key) => onChangeHandler("icon", key)} />
        </Modal>
    )
}

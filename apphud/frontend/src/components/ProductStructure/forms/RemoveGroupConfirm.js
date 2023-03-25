import React, { useState } from "react";
import Modal from "../Modal";

export default function RemoveGroupConfirm({ onCancel, onSuccess, loading }) {
    const [ confirm, setConfirm] = useState(false);
    return (
        <Modal
            color="red"
            loading={loading || !confirm}
            visible={true}
            label={"Confirm removal"}
            cancelText={"Cancel"}
            successText={"Remove group"}
            onCancel={onCancel}
            onSuccess={onSuccess}>
            <p>
                Do you really want to remove this group?
                <br/><br/>
                All products belonging to this group will be removed and products IDs will be moved to the “Uncategorized products” section.
                <br/><br/>
                If you have products from this group in paywall configs, they will be deleted from there.
            </p>
            <br/>
            <label>
                <input type="checkbox"  onChange={(e) =>  setConfirm(e.target.checked)}/>&nbsp;
                I'm sure I want to remove group
            </label>
        </Modal>
    )
}

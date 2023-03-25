import React from "react";
import Modal from "../Modal";

export default function CreateGroupConfirm({ onCancel, onSuccess }) {
    return (
        <Modal
            loading={false}
            visible={true}
            label={"Do you really need this?"}
            cancelText={"Cancel"}
            successText={"Create group"}
            onCancel={onCancel}
            onSuccess={onSuccess}>
            <p>Do you really have more than one permission group? Developers usually have only one permission group.</p>
        </Modal>
    )
}

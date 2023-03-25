import React from "react";
import Modal from "../Modal";

export default function RemoveProductConfirm({ onCancel, onSuccess, loading }) {
    return (
        <Modal
            color="red"
            loading={loading}
            visible={true}
            label={"Confirm removal"}
            cancelText={"Cancel"}
            successText={"Remove product"}
            onCancel={onCancel}
            onSuccess={onSuccess}>
            <p>
                Do you really want to remove this product?
                <br/><br/>
                It’s going to be removed from all paywall configs. Double-check that before you delete it.
            </p>
        </Modal>
    )
}

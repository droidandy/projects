import React from "react";
import Modal from "../Modal";

export default function RemovePaywallProductConfirm({ onCancel, onSuccess, loading }) {
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
                Do you really want to remove this product from paywall?
            </p>
        </Modal>
    )
}

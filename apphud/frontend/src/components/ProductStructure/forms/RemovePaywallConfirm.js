import React from "react";
import Modal from "../Modal";

export default function RemovePaywallConfirm({ onCancel, onSuccess, loading }) {
    return (
        <Modal
            color="red"
            loading={loading}
            visible={true}
            label={"Confirm removal"}
            cancelText={"Cancel"}
            successText={"Remove paywall"}
            onCancel={onCancel}
            onSuccess={onSuccess}>
            <p>Do you really want to remove this paywall?</p>
            <br/>
            <p>
                You won’t get any products from this paywall in your apps anymore.
            </p>
        </Modal>
    )
}

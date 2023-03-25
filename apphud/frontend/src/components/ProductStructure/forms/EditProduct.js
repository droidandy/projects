import React from "react";
import Product from "./Product";

export default function EditProduct({ initData = {}, onSuccess, ...rest }) {
    const data = {
        ...initData,
        app_store_product_id: initData.products?.find(e => e.store === "app_store")?.product_id,
        play_store_product_id: initData.products?.find(e => e.store === "play_store")?.product_id
    }
    return <Product
        label="Edit product"
        successText="Save"
        initData={data}
        onSuccess={(data) => onSuccess(data, initData.id)}
        {...rest}
    />
}

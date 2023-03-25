import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import Item from "./Item";
import PaywallConfig, {PaywallConfigTypes} from "../forms/PaywallConfig";
import axios from "axios";
import RemovePaywallConfirm from "../forms/RemovePaywallConfirm";
import CreatePaywallProduct from "../forms/CreatePaywallProduct";
import EmptyPaywall from "../EmptyPaywall";
import EditPaywallProduct from "../forms/EditPaywallProduct";
import RemovePaywallProductConfirm from "../forms/RemovePaywallProductConfirm";
import {track} from "../../../libs/helpers";

export default function PaywallConfigList({ appId, createAction = false, createActionCallback }) {
    const [state, setState] = useState(null);
    const [products, setProducts] = useState([]);
    const [modal, setModal] = useState("");
    const [loading, setLoading] = useState(false);
    const onLoadPaywallConfigs = () => {
        axios
            .get(`/apps/${appId}/paywall_configs`)
            .then(({data}) => {
                const { data: { results } } = data;
                setState(results.map((el) => {
                    const stack = 5 - el.items.length > 0 ? 5 - el.items.length : 0;
                    const arr = Array.from(Array(stack).keys()).map(v => ({ id: v }));
                    return {
                        ...el,
                        items: [...arr, ...el.items]
                    }
                }));
            }).finally(()=> {
                setLoading(false);
                setModal("");
                createActionCallback();
            })
        ;
        axios.get(`/apps/${appId}/product_groups`).then(({data}) => {
            let res = [];
            for(const g of data.data.results.filter((e) => e?.product_bundles)) {
                res = res.concat(g.product_bundles.map((p) => ({ label: p.name, value: p.id })));
            }
            setProducts(res);
        })
    }
    const onCreatePaywallConfig = (data) => {
        setLoading(true);
        axios
            .post(`/apps/${appId}/paywall_configs`, data)
            .then(onLoadPaywallConfigs)
            .finally(() => {
                setLoading(false);
                track("paywall_created", data);
            })
        ;
    }
    const onUpdatePaywallConfig = (data, id) => {
        setLoading(true);
        axios
            .put(`/paywall_configs/${id}`, data)
            .then(onLoadPaywallConfigs)
            .finally(() => {
                setLoading(false);
                track("paywall_edited", data)
            })
        ;
    }
    const onRemovePaywallConfig = (id) => {
        setLoading(true);
        axios
            .delete(`/paywall_configs/${id}`)
            .finally(onLoadPaywallConfigs)
        ;
        track("paywall_removed", {id});
    }
    const onCreatePaywallProduct = (data, id) => {
        setLoading(true);
        axios
            .post(`/paywall_configs/${id}/paywall_items`, data)
            .then(onLoadPaywallConfigs)
            .finally(() => {
                setLoading(false);
                track("paywall_product_added", { data, id });
            })
        ;
    }
    const onUpdatePaywallProduct = (data, id) => {
        setLoading(true);
        axios
            .put(`/paywall_items/${id}`, data)
            .then(onLoadPaywallConfigs)
            .finally(() => setLoading(false))
        ;
    }
    const onRemovePaywallProduct = (id) => {
        setLoading(true);
        axios
            .delete(`/paywall_items/${id}`)
            .finally(onLoadPaywallConfigs)
        ;
        track("paywall_product_removed", { id });
    }
    const onDragEndHandler = (result) => {
        if (!result) return;
        const { droppableId, index } = result.destination;
        const { items = [] } = state.find((el) => el.id === droppableId);
        const reorder = (list, startIndex, endIndex) => {
            const result = Array.from(list);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            return result;
        };
        const ordered = reorder(items, result.source.index, index);
        setState(
            state.map((el) => {
                if (el.id === droppableId) {
                    return {
                        ...el,
                        items: ordered
                    }
                }
                return el;
            })
        );
        axios.put(`/paywall_items/${result.draggableId}`, {
            order: items.length - result.destination.index
        }).finally(() => {
            track("paywall_product_order_changed", {id:result.draggableId});
        });
    }
    useEffect(() => {
        onLoadPaywallConfigs();
    }, []);
    return (
        <>
            <div className="container-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="va-middle text-black">Paywalls</span>
                { state && state.length > 0
                    && <a
                        onClick={() => {
                            setModal({
                                name: "create_paywall",
                                data: {}
                            })
                        }}
                        className="button button_225 button_green button_inline-block">
                        Create paywall
                    </a>
                }
            </div>
            <div className="container-content__notification">
          <span>
              Combine products in paywalls to easily manage in-app purchases.
          </span>
                &nbsp;
                <a
                    onClick={() => track("paywall_learn_more_link_clicked")}
                    className="container-content__learn-more-btn no"
                    href="https://docs.apphud.com/getting-started/product-hub/paywalls"
                    target="_blank">
                    &nbsp; Learn more
                </a>
            </div>
            <br/>

            { state
                && <>
                    {state.length > 0
                        ? <div className={styles.paywall}>
                            {state.map((el, key) => (
                                <Item
                                    onEdit={() => setModal({
                                        name: "edit_paywall",
                                        data: el
                                    })}
                                    onRemove={() => setModal({
                                        name: "remove_paywall",
                                        data: el
                                    })}
                                    onAddProduct={() => setModal({
                                        name: "product_paywall",
                                        data: el
                                    })}
                                    onEditProduct={(data) => {
                                        setModal({
                                            name: "edit_product_paywall",
                                            data: {
                                                id: data?.id,
                                                available_items: el?.available_items,
                                                product_bundle_id: data?.bundle_id
                                            }
                                        })
                                    }}
                                    onMakeDefault={() => {
                                        onUpdatePaywallConfig({default: true}, el.id);
                                        track("paywall_made_default", el);
                                    }}
                                    onRemoveDefault={() => {
                                      onUpdatePaywallConfig({default: false}, el.id)
                                    }}
                                    onRemoveProduct={(data) => setModal({
                                        name: "remove_paywall_product",
                                        data: data
                                    })}
                                    onDragEnd={onDragEndHandler}
                                    data={el?.items}
                                    id={el?.id}
                                    label={el?.name}
                                    isDefault={el?.default}
                                    description={el?.identifier}
                                    key={key}
                                />
                            ))}
                        </div>
                        : <EmptyPaywall
                            onCreateConfig={() => {
                                setModal({
                                    name: "create_paywall",
                                    data: {}
                                })
                            }}
                        />
                    }
                </>
            }
            { modal?.name === PaywallConfigTypes.create
                && <PaywallConfig
                    loading={loading}
                    onSuccess={onCreatePaywallConfig}
                    onCancel={() => setModal("")}
                />
            }
            { modal?.name === PaywallConfigTypes.edit
                && <PaywallConfig
                    type={PaywallConfigTypes.edit}
                    label="Edit paywall"
                    initData={modal?.data}
                    loading={loading}
                    onSuccess={(data) => onUpdatePaywallConfig(data, modal?.data.id)}
                    onCancel={() => setModal("")}
                />
            }
            { modal?.name === "remove_paywall"
                && <RemovePaywallConfirm
                    loading={loading}
                    onSuccess={() => onRemovePaywallConfig(modal?.data.id)}
                    onCancel={() => setModal("")}
                />
            }
            { modal?.name === "remove_paywall_product"
                && <RemovePaywallProductConfirm
                    loading={loading}
                    onSuccess={() => onRemovePaywallProduct(modal?.data.id)}
                    onCancel={() => setModal("")}
                />
            }
            { modal?.name === "product_paywall"
                && <CreatePaywallProduct
                    loading={loading}
                    products={modal?.data.available_items}
                    onSuccess={(data) => onCreatePaywallProduct(data, modal?.data.id)}
                    onCancel={() => setModal("")}
                />
            }
            { modal?.name === "edit_product_paywall"
                && <EditPaywallProduct
                    initData={modal?.data}
                    loading={loading}
                    products={modal?.data.available_items}
                    onSuccess={(data) => onUpdatePaywallProduct(data, modal?.data.id)}
                    onCancel={() => setModal("")}
                />
            }
        </>
    )
}

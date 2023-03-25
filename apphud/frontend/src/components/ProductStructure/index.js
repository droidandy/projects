import React, { useState, useEffect } from "react";
import icon from "./icon.svg";
import GroupList from "./GroupList";
import PermissionGroup from "./forms/PermissionGroup";
import Product from "./forms/Product";
import axios from "axios";
import EditProduct from "./forms/EditProduct";
import CreateGroupConfirm from "./forms/CreateGroupConfirm";
import RemoveProductConfirm from "./forms/RemoveProductConfirm";
import EditPermissionGroup from "./forms/EditPermissionGroup";
import RemoveGroupConfirm from "./forms/RemoveGroupConfirm";
import MoveProduct from "./forms/MoveProduct";
import DefaultInput from "../DefaultInput";
import UnCategorizedProducts from "./UnCategorizedProducts";
import MoveProductId from "./forms/MoveProductId";
import EditProductId from "./forms/EditProductId";
import {track} from "../../libs/helpers";

export default function ProductStructure({ appId, hideHeading = false }) {
    const [untitledState, setUntitledState] = useState([]);
    const [state, setState] = useState([]);
    const [filteredData, setFilteredData] = useState(null);
    const [modal, setModal] = useState("");
    const [loading, setLoading] = useState(false);
    const onLoadProductList = () => {
        axios
            .get(`/apps/${appId}/product_groups`)
            .then(({data}) => {
                const { data: { results } } = data;
                setUntitledState(results.filter((e) => e.products !== undefined))
                setState(results.filter((e) => e.product_bundles !== undefined));
            }).finally(()=> {
                setLoading(false);
                setModal("");
                setFilteredData(null);
            })
        ;
    }
    const onCreateProduct = (data) => {
        setLoading(true);
        axios
            .post(`/apps/${appId}/product_bundles`,data)
            .then(onLoadProductList)
            .finally(() => {
                setLoading(false);
                track("product_added", data);
            });
    };
    const onEditProduct = (data, id, tracking = true) => {
        setLoading(true);
        axios
            .put(`/product_bundles/${id}`,data)
            .then(onLoadProductList)
            .finally(() => {
                setLoading(false);
                if (tracking) track("product_edited", data);
            });
    };
    const onEditProductId = (data, id, tracking = true, callback = null) => {
        setLoading(true);
        axios
            .put(`/products/${id}`,data)
            .then((e) => {
                onLoadProductList(e)
                if (tracking) track("uncategorized_product_id_edited", data);
                if (callback) {
                    callback(data);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const onRemoveProduct = (id) => {
        setLoading(true);
        track("product_removed", { id });
        axios
            .delete(`/product_bundles/${id}`)
            .finally(onLoadProductList);
    }
    const onRemoveUntitledProduct = (id) => {
        setLoading(true);
        track("uncategorized_product_id_removed", { id });
        axios
            .delete(`/products/${id}`)
            .finally(onLoadProductList);
    }
    const onRemoveGroup = (id) => {
        setLoading(true);
        track("permission_group_deleted", { id });
        axios
            .delete(`/product_groups/${id}`)
            .finally(onLoadProductList);
    }
    const onCreateGroup = (data) => {
        setLoading(true);
        axios
            .post(`/apps/${appId}/product_groups`, data)
            .then(onLoadProductList)
            .finally(() => {
                setLoading(false);
                track("permission_group_created", data);
            });
    }
    const onEditGroup = (data, id) => {
        setLoading(true);
        axios
            .put(`/product_groups/${id}`, data)
            .then(onLoadProductList)
            .finally(() => {
                setLoading(false);
                track("permission_group_edited", data);
            });
    }
    const onSearchHandler = (e) => {
        const data = state.map((el) => {
            return {
                ...el,
                product_bundles: el.product_bundles?.filter((p) => p.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1)
            }
        });
        setFilteredData(data.filter((p) => p?.product_bundles?.length > 0));
        track("product_filtered", {
            query: e.target.value
        });
    }
    useEffect(onLoadProductList, []);
    return <div>
        <div className="container-content__integrations-settings__content-title">
            { !hideHeading
                && <>
                    <img src={icon} />
                    <span>Product structure</span>
                    <UnCategorizedProducts
                        data={untitledState}
                        onEdit={(data) => {
                            setModal({
                                name: "edit_product_id",
                                data: data
                            })
                        }}
                        onMove={(data) => {
                            setModal({
                                name: "move_product_id_2",
                                data: {
                                    ...data,
                                    [`${data?.store}_product_id`]: data?.product_id
                                }
                            })
                        }}
                        onRemove={(data) => {
                            setModal({
                                name: "remove_untitled_product",
                                data: data
                            })
                        }}
                    />
                    <br/><br/>
                    <div>
                        <DefaultInput
                            className="input input_search input_255 input_blue"
                            placeholder="Search by Products"
                            onChange={onSearchHandler}
                        />
                    </div>
                    <br/>
                </>
            }
            <GroupList
                data={filteredData || state}
                onRemoveGroup={(data) => {
                    setModal({
                        name: "remove_group",
                        data: data
                    })
                }}
                onRemoveProduct={(data) => {
                    setModal({
                        name: "remove_product",
                        data: data
                    })
                }}
                onCreateProduct={(id) => {
                    setModal({
                        name: "product",
                        data: {
                            group_id: id
                        }
                    })
                }}
                onCreateGroup={() => {
                    setModal({
                        name: "pre_group"
                    })
                }}
                onEditProduct={(data) => {
                    setModal({
                        name: "edit_product",
                        data: data
                    })
                }}
                onMoveProduct={(data) => {
                    setModal({
                        name: "move_product",
                        data: data
                    })
                }}
                onEditGroup={(data) => {
                    setModal({
                        name: "edit_group",
                        data: data
                    })
                }}
            />

            { modal?.name === "move_product"
                && <MoveProduct
                    loading={loading}
                    initData={modal?.data}
                    groups={state.map(el => ({ label: el.name, value: el.id }))}
                    onCancel={() => setModal("")}
                    onSuccess={(data) => {
                        track("product_moved", data);
                        onEditProduct(data, data.id, false)
                    }}
                />
            }

            { modal?.name === "move_product_id"
                && <MoveProductId
                    loading={loading}
                    initData={modal?.data}
                    groups={state}
                    onCancel={() => setModal("")}
                    onSuccess={(data) => {
                        onEditProductId(data, data.id);
                    }}
                />
            }

            { modal?.name === "move_product_id_2"
                && <Product
                    label="Move product id"
                    loading={loading}
                    initData={{ ...modal?.data, group_id: state[0]?.id}}
                    mode={"move"}
                    groups={state.map(el => ({ label: el.name, value: el.id }))}
                    onCancel={() => setModal("")}
                    onSuccess={(data) => {
                        onEditProductId(data, data.id, false, () => {
                            track("uncategorized_product_id_moved", data);
                        });
                    }}
                />
            }
            { modal?.name === "remove_untitled_product"
                && <RemoveProductConfirm
                    loading={loading}
                    onSuccess={() => {
                        onRemoveUntitledProduct(modal?.data.id)
                    }}
                    onCancel={() => setModal("")}
                />
            }

            { modal?.name === "remove_product"
                && <RemoveProductConfirm
                    loading={loading}
                    onSuccess={() => onRemoveProduct(modal?.data.id)}
                    onCancel={() => setModal("")}
                />
            }

            { modal?.name === "remove_group"
                && <RemoveGroupConfirm
                    loading={loading}
                    onSuccess={() => onRemoveGroup(modal?.data.id)}
                    onCancel={() => setModal("")}
                />
            }

            { modal?.name === "pre_group"
                && <CreateGroupConfirm
                    onSuccess={()=> setModal({ name: "group" })}
                    onCancel={() => setModal("")}
                />
            }
            { modal?.name === "group"
                && <PermissionGroup
                    loading={loading}
                    onCancel={() => setModal("")}
                    onSuccess={onCreateGroup}
                />
            }
            { modal?.name === "edit_group"
                && <EditPermissionGroup
                    loading={loading}
                    initData={modal?.data}
                    onCancel={() => setModal("")}
                    onSuccess={onEditGroup}
                />
            }
            { modal?.name === "product"
                && <Product
                    loading={loading}
                    initData={modal?.data}
                    groups={state.map(el => ({ label: el.name, value: el.id }))}
                    onCancel={() => setModal("")}
                    onSuccess={onCreateProduct}
                />
            }
            { modal?.name === "edit_product"
                && <EditProduct
                    loading={loading}
                    initData={modal?.data}
                    groups={state.map(el => ({ label: el.name, value: el.id }))}
                    onCancel={() => setModal("")}
                    onSuccess={onEditProduct}
                />
            }
            { modal?.name === "edit_product_id"
                && <EditProductId
                    loading={loading}
                    initData={modal?.data}
                    groups={state.map(el => ({ label: el.name, value: el.id }))}
                    onCancel={() => setModal("")}
                    onSuccess={(data) => onEditProductId(data, data.id)}
                />
            }
        </div>
    </div>;
}

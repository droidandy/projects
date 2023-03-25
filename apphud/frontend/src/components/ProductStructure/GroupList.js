import React from "react";
import styles from "./index.module.scss";
import PermissionGroup from "./PermissionGroup";
import Product from "./Product";
import Button from "./Button";

export default function GroupList({ data = [], onCreateGroup, onCreateProduct, onEditProduct, onRemoveProduct, onEditGroup, onRemoveGroup, onMoveProduct }) {
    return <>
        <div className={styles.groupList}>
            <div className={styles.area}>
                <div className={styles.label}>
                    permission GROUPS
                </div>
            </div>
            <div className={styles.area}>
                <div className={styles.label}>
                    PRODUCTS
                </div>
            </div>
        </div>
        {data.map((permission, key) => (
            <div className={styles.groupList} key={key}>
                <div className={styles.area}>
                    <div className={styles.groupWrapper}>
                        <PermissionGroup
                            data={permission}
                            onRemove={onRemoveGroup}
                            onEdit={onEditGroup}
                            hideRemove={data.length === 1}
                        />
                    </div>
                </div>
                <div className={styles.area}>
                    <div>
                        {permission.product_bundles?.map((product, _key) => (
                            <div className={`${styles.productWrapper} ${permission.product_bundles?.length === 1 && styles.productSingle } `}  key={_key}>
                                <Product
                                    data={{ ...product, group_id: permission?.id}}
                                    onEdit={onEditProduct}
                                    onMove={onMoveProduct}
                                    onRemove={onRemoveProduct}
                                />
                            </div>
                        ))}
                    </div>
                    <div className={styles.actionsWrapper}>
                        <Button label="Add product" onClick={() => onCreateProduct(permission?.id)} />
                    </div>
                </div>
            </div>
        ))}
        <div className={styles.groupList}>
            <div className={styles.area}>
                <div className={styles.actionsWrapper}>
                    <Button label="Create group" color="green" onClick={onCreateGroup} />
                </div>
            </div>
            <div className={styles.area} />
        </div>
    </>
}

import React from "react";
import Link from "next/link";
import styles from "./index.module.scss";
import Button from "../../UI/Button";

export default function PageNotFound() {
    return <div className={styles.root}>
        <img src={require("./assets/404.svg")} className={styles.img} />
        <label className={styles.label}>Sorry, we can’t find that page</label>
        <div className={styles.actions}>
            <Link href="/">
                <Button title="Back to Homepage" />
            </Link>
        </div>
    </div>;
}

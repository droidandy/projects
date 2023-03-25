import React, { useState, useRef } from "react";
import styles from "./index.module.scss";
import Button from "../../UI/Button";
import PropTypes from 'prop-types';
import {getErrorText} from "./getErrorText";

export function ResponseView({ data }) {
    const type = data ? ((data?.status || data?.error) ? "warning" : "success") : "default";
    const error = getErrorText(data?.status);
    const ref = useRef(null);
    const [copied, setCopied] = useState(false);
    const onCopyHandler = () => {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(ref.current);
        selection.removeAllRanges();
        selection.addRange(range);
        if (document.execCommand('copy')) {
            window.getSelection().removeAllRanges();
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
        }
    }
    return <div className={`${styles.response} ${styles.grid}`}>
        <label className={styles.label}>Receipt Status</label>
        { error
            && <p className={styles.error}>
                Error {data?.status}: {error}
            </p>
        }
        <pre className={`${styles.result} ${styles[type]}`}>
            <code data-json="result">
                { type === "success"
                    && <>
                        <span
                            onClick={onCopyHandler}
                            className={styles.copy}>
                            { copied ? "Copied" : "Copy receipt" }
                        </span>
                        <br/><br/>
                    </>
                }
                <span ref={ref}>
                    {JSON.stringify(data, null, 4)}
                </span>
            </code>
        </pre>
    </div>
}

export default function AppleReceiptChecker({ endpoint }) {
    const [data, setData] = useState(null);
    const [values, setValues ] = useState({
        data: "",
        secret: "",
        storeKit: false,
    })
    const [disabled, setDisabled] = useState(false);
    const onClickHandler = (data) => {
        setData(null);
        setDisabled(true);
        endpoint(data).then(r => r.json())
            .then(setData)
            .finally(() => setDisabled(false))
        ;
    }
    return <>
        <div className={`${styles.root} ${styles.grid}`}>
            <div className={styles.row}>
                <label className={styles.label}>Paste Base64 encoded receipt data below</label>
                <textarea
                     className={styles.input}
                     placeholder={"MIIT7AYJKoZIhvcNAQcCoIIT3TCCE..."}
                     onChange={(e) => {
                        setValues({
                            ...values,
                            data: e.target.value.trim()
                        })
                    }}
                />
            </div>
            <div className={styles.row}>
                <label className={styles.label}>Add the app-specific shared secret</label>
                <input
                    type="text"
                    className={styles.input}
                    value={values?.secret}
                    placeholder={"c0e66ec014fb2a734..."}
                    onChange={(e) => setValues({
                        ...values,
                        secret: e.target.value.trim()
                    })}
                />
            </div>
            <div className={styles.row}>
                <label>
                    <input
                        type="checkbox"
                        checked={values?.storeKit}
                        onChange={(e) => setValues({
                            ...values,
                            storeKit: e.target.checked
                        })}
                    />
                    &nbsp;
                    Purchased using StoreKit Configuration File
                </label>
            </div>
            <div className={`${styles.row} ${styles.actions}`}>
                <Button
                    border={true}
                    transparent={data !== null}
                    title={`${disabled? "Loading..." : "Check Receipt"}`}
                    disabled={disabled || values.data.length === 0 }
                    onClick={() => onClickHandler(values)}
                />
                <p>
                    Application will be sent securely and remain private
                </p>
            </div>
        </div>
        { data
            && <ResponseView status={data?.status} data={data} />
        }
    </>
}

AppleReceiptChecker.propTypes = {
    endpoint: PropTypes.func,
};

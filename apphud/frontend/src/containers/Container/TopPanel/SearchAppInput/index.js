import React, { useState } from "react";
import axios from "axios";
import styles from "./index.module.scss";

export default function SearchAppInput() {
    const [data, setData] = useState([]);
    const onChangeHandler = (e) => {
        const value = e.target.value;
        if (value.length > 0) {
            axios.get(`/su/apps_search?q=${value}`).then(({ data }) => setData(data?.data?.results))
        }else{
            setData([]);
        }
    }
    const onClickHandler = (appId) => {
        setData([]);
        axios.get(`/su/token?app_uid=${appId}`).then(({ data }) => {
            const { results } = data?.data;
            window.location.href =  `${window.location.origin}/apps/${appId}/dashboard?t=${results?.token}`
        })
    }
    return <div className={styles.root}>
        <input
            onChange={onChangeHandler}
            className="input input_search input_255 input_blue"
            placeholder="Search the app"
            autoComplete={`value-${Math.random()}`}
        />
        { data.length > 0
            && <div className={styles.results}>
                {data.map((el, key) => (
                    <div
                        onClick={() => onClickHandler(el.id)}
                        className={styles.item}
                        key={key}>{el.name} ({el.id})</div>
                ))}
            </div>
        }
    </div>
}

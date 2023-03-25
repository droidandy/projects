import React, { useState, useEffect } from "react";

const defGetValue = (val) => {
    return val;
};

export default function useSort(data = {}, _field = "name", _order = 0) {
    const [field, setField] = useState(_field);
    const [order, setOrder] = useState(_order);
    const [getValue, setGetValue] = useState({ func: defGetValue });
    const sortHandler = (a, b) => {
        const value1 = getValue.func(a[field]);
        const value2 = getValue.func(b[field]);
        if (value1 < value2) {
            return order;
        }
        if (value1 > value2) {
            return order * -1;
        }
        return 0;
    }
    useEffect(() => setField(_field), [_field]);
    useEffect(() => setOrder(_order), [_order]);
    return {
        order,
        setOrder,
        field,
        setField,
        setGetValue,
        data: {
            ...data,
            datasets: data?.datasets?.sort(sortHandler)
        }
    };
}

import {formatMoney} from "../../../../../libs/helpers";

export function getValue(value, type = null) {
    switch (type) {
        case "percent":
            return `${value}%`;
        case "money":
            return `${value < 0 ? "-":""}$${formatMoney(Math.abs(value))}`;
        default:
            return `${value}`;
    }
}

export default (label, value, type = null) => {
    return `${label}: ${getValue(value, type)}`;
}

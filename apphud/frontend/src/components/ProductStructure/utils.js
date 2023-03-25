export const truncate = (value, size = 24) => {
    if (value.length > size) {
        const start = value.slice(value.length - size + 3);
        return `...${start}`;
    }
    return value;
}

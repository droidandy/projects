export const getDaysInMonthMode = (date, from = 0, to = 42) => {
    const days = Array(42)
        .fill()
        .map((_, i) =>
            date
                .startOf('month')
                .startOf('week')
                .plus({ days: i })
                .minus({ days: 1 })
        );
    return days.filter((dt) => {
        return dt >= from && dt <= to;
    })
}

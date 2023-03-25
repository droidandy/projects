import moment from "moment";

export const getParamsForChartsRequest = ({appId, range, currentChart, filter, timezone, type, pagination}) => {
    if(!filter) {
        return null;
    }

    const time_range = {
      from: moment(range.from)
        .startOf("day")
        .utcOffset(timezone, true)
        .format("YYYY-MM-DD[T]HH:mm:ss.SSSZ"),
      to: moment(range.to)
        .endOf("day")
        .utcOffset(timezone, true)
        .format("YYYY-MM-DD[T]HH:mm:ss.SSSZ")
    };

    let params = {
      app: appId,
      chart: currentChart,
      filters: filter.filters,
      time_range: { ...time_range, step: filter?.time_range?.step },
    };

    if (filter?.calc_method) {
      params.calc_method = filter.calc_method;
    }

    if (type === 'column') {
      params = {
        ...params,
        pagination: {
          offset: pagination.offset,
          limit: pagination.limit,
        },
        segments: filter?.segments.filter((e) => e.id !== null),
      };
    } else {
      params = {
        ...params,
        segment: filter?.segment?.id === null ? null : filter?.segment,
      };
    }

    return params;
}

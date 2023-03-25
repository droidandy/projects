import axios from "axios"
import moment from "moment"

let cancelToken;

export default class DashboardApi {

    static getNowDashboards(appId, platform) {
        return axios.post("/api/v1/dash/now", {
            app: appId,
            platform,
        })
    }

    static getRangeDashboards(appId, timeFrom, timeTo, timezone = 0, platform) {
        if (typeof cancelToken !== typeof undefined) {
            cancelToken.cancel("Operation canceled due to new request.");
        }
        cancelToken = axios.CancelToken.source();
        return axios.post("/api/v1/dash/range", {
            app: appId,
            platform,
            time_range: {
                from: moment(timeFrom).startOf("day").utcOffset(timezone, true).format("YYYY-MM-DD[T]HH:mm:ss.SSSZ"),
                to: moment(timeTo).endOf("day").utcOffset(timezone, true).format("YYYY-MM-DD[T]HH:mm:ss.SSSZ")
            }
        }, {
            cancelToken: cancelToken?.token
        })
    }

    static getConversions(appId, timeFrom, timeTo, timezone = 0, platform) {
        return axios.post("/api/v1/dash/conversions", {
            app: appId,
            platform,
            time_range: {
                from: moment(timeFrom).startOf("day").utcOffset(timezone, true).format("YYYY-MM-DD[T]HH:mm:ss.SSSZ"),
                to: moment(timeTo).endOf("day").utcOffset(timezone, true).format("YYYY-MM-DD[T]HH:mm:ss.SSSZ")
            }
        })
    }
}

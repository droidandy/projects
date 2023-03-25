import axios from "axios"

class ChartApi {
    static async getChartList() {
        const { data: { chart_groups }} = await axios.get("/api/v1/chart/list")
        return chart_groups
    }

    static async getChartOptions(appId, chartId) {
        const { data } = await axios.get(`/api/v1/chart/options?app=${appId}&chart=${chartId}`)
        return data
    }

    static async getChartLines(postData) {
        const { data } = await axios.post("/api/v1/chart/query/line", postData)
        return data
    }

    static async getChartColumns(postData) {
        const { data } = await axios.post("/api/v1/chart/query/column", postData)
        return data
    }
}

export default ChartApi

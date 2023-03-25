import React from "react"

class ChartOptionsTransformer {

    static resolutions = [
        {
            id: 86400,
            name: "Day"
        },
        {
            id: 86400 * 7,
            name: "Week"
        },
        {
            id: 86400 * 30,
            name: "Month"
        }
    ]

    static transform(data) {
        return {
            filters: data.filter_groups.map((elem, key) => ({
                name: elem.name,
                id: key,
                options: elem.filters
            })),
            segments: data.segment_groups.map((elem, key) => ({
                name: elem.name,
                id: key,
                options: elem.segments
            })),
            resolutions: this.resolutions
        }
    }
}

export default ChartOptionsTransformer

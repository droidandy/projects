export const REVENUE_LINE = {
    credits: {
        enabled: false
    },
    chart: {
        height: 240
    },
    colors: ['#c6d92e'],
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
    yAxis: {
        title: {
            text: 'Earnings'
        }
    },
    legend: {
        enabled: false,
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    }
};
export const COMPLETED_TASKS_LINE = {
    credits: {
        enabled: false
    },
    chart: {
        height: 180
    },
    colors: ['#6ebe46', '#c6d92e'],
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
    yAxis: {
        title: {
            text: 'Tasks'
        }
    },
    legend: {
        enabled: false,
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    }
};
export const COMPLETED_TASKS = {
    credits: {
        enabled: false
    },
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        width: 180,
        height: 180
    },
    colors: ['#6ebe46', '#c6d92e'],
    title: {
        style: { color: '#58585a', fontSize: '18px' },
        align: 'center',
        verticalAlign: 'middle',
        y: 7
    },
    tooltip: {
        // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enabled: false,
                distance: -50,
                style: {
                    fontWeight: 'bold',
                    color: 'white'
                }
            },
            startAngle: 0,
            endAngle: 360,
            center: ['50%', '50%']
        }
    },
    series: [{
        type: 'pie',
        name: '',
        innerSize: '70%'
    }]
};
export const GOFUNDIS = {
    credits: {
        enabled: false
    },
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        width: 180,
        height: 180
    },
    colors: ['#1d5c51', '#c21f50'],
    title: {
        style: { color: '#58585a', fontSize: '18px' },
        align: 'center',
        verticalAlign: 'middle',
        y: 7
    },
    tooltip: {
        // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enabled: false,
                distance: -50,
                style: {
                    fontWeight: 'bold',
                    color: 'white'
                }
            },
            startAngle: 0,
            endAngle: 360,
            center: ['50%', '50%']
        }
    },
    series: [{
        type: 'pie',
        name: '',
        innerSize: '70%'
    }]
};
export const APPROVED_GOFUNDIS = {
    credits: {
        enabled: false
    },
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        width: 180,
        height: 180
    },
    colors: ['#f5ab33', '#f2ec2b'],
    title: {
        style: { color: '#58585a', fontSize: '18px' },
        align: 'center',
        verticalAlign: 'middle',
        y: 7
    },
    tooltip: {
        // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enabled: false,
                distance: -50,
                style: {
                    fontWeight: 'bold',
                    color: 'white'
                }
            },
            startAngle: 0,
            endAngle: 360,
            center: ['50%', '50%']
        }
    },
    series: [{
        type: 'pie',
        name: '',
        innerSize: '70%'
    }]
};
export const NUMBER_OF_GOFUNDIS = {
    credits: {
        enabled: false
    },
    colors: ['#1d5c51', '#c21f50'],
    chart: {
        height: 190
    },
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
    yAxis: {
        title: {
            text: 'GoFundis'
        }
    },
    legend: {
        enabled: false,
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    }
};
export const LIVE_ACTIVE_GOFUNDIS = {
    credits: {
        enabled: false
    },
    colors: ['#cc6631'],
    chart: {
        type: 'column',
        height: 190
    },
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {
        title: {
            text: ''
        }

    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: true
                // format: '{point.y:.1f}%'
            }
        }
    },

    tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat:
        '<span style="color:{point.color}">{point.name}</span>:' +
        ' <b>{point.y:.2f}</b><br/>'
    },

    series: [{
        name: 'Area',
        colorByPoint: false
    }]
};
export const SUBSCRIBERS_SHARE_PER_AREA = {
    credits: {
        enabled: false
    },
    colors: ['#cc6631'],
    chart: {
        type: 'column',
        width: 230,
        height: 230
    },
    title: {
        text: ''
    },
    subtitle: {
        text: ''
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {
        title: {
            text: ''
        }

    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            borderWidth: 0,
            dataLabels: {
                enabled: true
                // format: '{point.y:.1f}%'
            }
        }
    },

    tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>:' +
        ' <b>{point.y:.2f}</b><br/>'
    },

    series: [{
        name: 'Area',
        colorByPoint: false
    }]
};

export const COMPLETED_TASKS_LINE = {
    credits: {
        enabled: false
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
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    series: [{
        name: 'Installations',
        data: [49, 55, 51, 66, 90, 199, 171, 241]
    }, {
        name: 'Repair Services',
        data: [29, 40, 97, 21, 20, 22, 31, 44]
    }]
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
        text: '<strong>120</strong>',
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
        innerSize: '70%',
        data: [
            ['Repair Services', 40.00],
            ['Installations', 60.00]
        ]
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
        text: '<strong>250</strong>',
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
        innerSize: '70%',
        data: [
            ['Onboarding', 15.00],
            ['Approved', 85.00]
        ]
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
        text: '<strong>200</strong>',
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
        innerSize: '70%',
        data: [
            ['Online', 80.00],
            ['Offline', 20.00]
        ]
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
    },
    xAxis: {
        categories:
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    series: [{
        name: 'Approved',
        data: [49, 55, 51, 66, 90, 199, 171, 241]
    }, {
        name: 'Onboarding',
        data: [29, 40, 97, 21, 20, 22, 31, 44]
    }]
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
        colorByPoint: false,
        data: [{
            name: '-1 hr',
            y: 150,
            drilldown: null
        }, {
            name: '-10 min',
            y: 53,
            drilldown: null
        }, {
            name: '-5 min',
            y: 203,
            drilldown: null
        }, {
            name: 'Now',
            y: 186,
            drilldown: null
        }]
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
        colorByPoint: false,
        data: [{
            name: 'Livington',
            y: 15800,
            drilldown: null
        }, {
            name: 'Westlands',
            y: 5323,
            drilldown: null
        }, {
            name: 'Kibra',
            y: 2963,
            drilldown: null
        }, {
            name: 'Kiambu',
            y: 1286,
            drilldown: null
        }, {
            name: 'Ruaka',
            y: 3265,
            drilldown: null
        }]
    }]
};

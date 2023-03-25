import { countries } from "../settings";
import renderValue, {getValue} from "../utils/renderValue";

export const getConversionOptions = (type, isConversions, chartUpdate) => {
  const getyAxes = () => {
    if (type !== "user count" && isConversions) {
      return [
        {
          ticks: {
            min: 0,
            max: 100,
            beginAtZero: true,
            fontFamily: "Ubuntu",
            fontColor: "#1A344B",
            callback: function(label, ...rest) {
              return `${label} %`;
            }
          },
          gridLines: {
            color: "#edf3f8",
            borderDash: [],
            zeroLineColor: "#edf3f8"
          }
        }
      ];
    }

    return [
      {
        ticks: {
          beginAtZero: true,
          fontFamily: "Ubuntu",
          fontColor: "#1A344B"
        },
        gridLines: {
          color: "#edf3f8",
          borderDash: [],
          zeroLineColor: "#edf3f8"
        }
      }
    ];
  };

  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true
          },
          gridLines: {
            color: "#edf3f8",
            borderDash: [],
            zeroLineColor: "#edf3f8"
          },
          ticks: {
            autoSkip: true,
            autoSkipPadding: 30,
            maxRotation: 0,
            fontFamily: "Ubuntu",
            fontColor: "#1A344B"
          }
        }
      ],
      yAxes: [...getyAxes()]
    },
    plugins: {
      datalabels: {
        display: false
      }
    },
    legend: {
      display: false
    },
    elements: {
      arc: {},
      point: {
        radius: 0,
        borderWidth: 1,
        hitRadius: 500,
        hoverRadius: 6,
        hoverBorderWidth: 0
      },
      line: {
        tension: 0.4,
        borderWidth: 2
      },
      rectangle: {}
    },
    tooltips: {
      displayColors: false,
      backgroundColor: "#1a344b",
      titleFontFamily: "Ubuntu",
      titleFontStyle: "normal",
      titleFontWeight: "400",
      bodyFontWeight: "400",
      bodyFontFamily: "Ubuntu",
      bodyFontSize: 13,
      xPadding: 10,
      yPadding: 10,
      cornerRadius: 8,
      callbacks: {
        title: (t, d) => {
          const item = d.datasets[t[0].datasetIndex];
          return item.label.replace("#", "") || t[0].label
        },
        label: (tooltipItems, data) => {
          if (data.typeValue === "money") {
            return `$ ${parseFloat(tooltipItems.value).toFixed(1)}`;
          }

          const percentage = type !== "user count" && isConversions ? "%" : "";
          return `${tooltipItems.value} ${percentage}`;
        }
      }
    },
    hover: {
      mode: "nearest",
      animationDuration: 0
    }
  };
};

export default (chart) => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        scaleLabel: {
          display: true
        },
        gridLines: {
          color: "#edf3f8",
          borderDash: [],
          zeroLineColor: "#edf3f8"
        },
        ticks: {
          autoSkip: true,
          autoSkipPadding: 30,
          maxRotation: 0,
          fontFamily: "Ubuntu",
          fontColor: "#1A344B"
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          fontFamily: "Ubuntu",
          fontColor: "#1A344B",
          callback: function(label) {
            if (chart?.datasets) {
              return getValue(label, chart?.datasets[0]?.typeValue);
            }
            return `${label}`;
          }
        },
        gridLines: {
          color: "#edf3f8",
          borderDash: [],
          zeroLineColor: "#edf3f8"
        }
      }
    ]
  },
  plugins: {
    datalabels: {
      display: false
    }
  },
  legend: {
    display: false
  },
  elements: {
    arc: {},
    point: {
      radius: 0,
      borderWidth: 1,
      hitRadius: 500,
      hoverRadius: 6,
      hoverBorderWidth: 0
    },
    line: {
      tension: 0.4,
      borderWidth: 2
    },
    rectangle: {}
  },
  tooltips: {
    displayColors: false,
    backgroundColor: "#1a344b",
    titleFontFamily: "Ubuntu",
    titleFontStyle: "normal",
    titleFontWeight: "400",
    bodyFontWeight: "400",
    bodyFontFamily: "Ubuntu",
    bodyFontSize: 13,
    xPadding: 10,
    yPadding: 10,
    cornerRadius: 8,
    callbacks: {
      label: (tooltipItems, data) => {
        const dataset = data.datasets[tooltipItems.datasetIndex];
        const type = dataset.typeValue;
        const label = countries[dataset.label] ||  dataset.label;
        if (dataset.tooltipData) {
          const point = dataset.tooltipData[tooltipItems.index];
          return point.values.map((o, i) => renderValue(i === 0 ? label : o.name, o.value, o.type));
        }
        return renderValue(label, tooltipItems.yLabel, type);
      }
    }
  },
  hover: {
    mode: "nearest",
    animationDuration: 0
  }
});

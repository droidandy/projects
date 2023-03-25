import * as React from 'react';
import { useActions } from 'typeless';
import { RouterActions } from 'typeless-router';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { ChartColor, ReportStats, FrequencyPeriod } from 'src/types';
import { useLanguage } from 'src/hooks/useLanguage';
import { useTranslation } from 'react-i18next';
import { GlobalActions } from 'src/features/global/interface';
import { getProjectsWidgetState } from './ProjectsWidget';

const getUnit = (dataItem: any) => {
  if (dataItem) {
    const dataContext = dataItem.dataContext;
    return { label: dataContext.unit, value: dataContext.unitId };
  }

  return { label: 'All', value: -1 };
}

const getPeriod = (period: FrequencyPeriod) : Date[] => {
  let monthCnt = 1;
  if (period.frequency === 'Annually') {
    monthCnt = 12;
  }
  else if (period.frequency === 'SemiAnnually') {
    monthCnt = 6;
  }
  else if (period.frequency === 'Quarterly') {
    monthCnt = 3;
  }
  return [new Date(period.year, monthCnt * (period.periodNumber - 1)), new Date(period.year, monthCnt * period.periodNumber, 0)];
}

const getStatus = (field: string) => {
  if (field === 'completed') {
    return { label: 'Completed', value: 'Green'};
  }
  else if (field === 'in_progress') {
    return { label: 'In Progress', value: 'Yellow'};
  }
  else if (field === 'late') {
    return { label: 'Late', value: 'Red'};
  }
  return { label: 'All', value: '*' };
}

export function useProjectsChart(stats: ReportStats[], isLoading: boolean) {
  const chartRef = React.useRef(null as HTMLDivElement | null);
  const lang = useLanguage();
  const { t } = useTranslation();
  const { push } = useActions(RouterActions);
  const { setInitiativeSearchFilter } = useActions(GlobalActions)

  React.useLayoutEffect(() => {
    if (!chartRef.current || isLoading) {
      return;
    }

    var chart = am4core.create(chartRef.current, am4charts.XYChart);

    chart.data = stats.map(item => {
      const getCount = (colors: ChartColor[]) => {
        return item.items.reduce((sum, x) => {
          if (colors.includes(x.color as ChartColor)) {
            return sum + x.count;
          } else {
            return sum;
          }
        }, 0);
      };
      return {
        unitId: item.unit.id,
        unit: item.unit.name[lang],
        completed: getCount(['green', 'blue']),
        in_progress: getCount(['yellow']),
        late: getCount(['red', 'gray']),
      };
    });

    chart.rtl = true;

    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'unit';
    categoryAxis.title.text = `[font-size: 13px; font-family:'Muli'; font-weight: 600; #B1BABF]${t(
      'All Units'
    )}[/]`;
    categoryAxis.title.align = 'right';
    categoryAxis.title.dx = 50;

    categoryAxis.renderer.grid.template.location = 0;

    categoryAxis.renderer.cellStartLocation = 0;
    categoryAxis.renderer.cellEndLocation = 1;

    categoryAxis.renderer.labels.template.fill = am4core.color('#B1BABF');
    categoryAxis.renderer.labels.template.fontSize = 12;
    categoryAxis.renderer.labels.template.fontWeight = '600';
    categoryAxis.renderer.grid.template.stroke = am4core.color('#ffffff');
    categoryAxis.maxWidth = 50;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.strictMinMax = true;

    valueAxis.title.text = `[font-size: 13px; font-family:'Muli'; font-weight: 600; #B1BABF]${t(
      'Number of Projects'
    )}[/]`;
    valueAxis.renderer.labels.template.fill = am4core.color('#B1BABF');
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.renderer.labels.template.fontWeight = '600';
    valueAxis.renderer.opposite = true;
    valueAxis.title.valign = 'bottom';
    valueAxis.title.rotation = 270;

    // Create series
    function createSeries(field: string, name: string, color: string) {
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = 'unit';
      series.name = name;
      series.columns.template.column.cornerRadiusTopLeft = 1;
      series.columns.template.column.cornerRadiusTopRight = 1;
      series.columns.template.clickable = true;
      series.columns.template.events.on("hit", (e) => {
        push(`/projects/listing`);
        let filter = {
          unit: getUnit(e.target.dataItem),
          type: { label: 'All', value: -1 },
          date: getPeriod(getProjectsWidgetState().period),
          status: getStatus(field),
        }
        setInitiativeSearchFilter(filter);
      });
      series.columns.template.tooltipText =
        '[bold]{name}[/]\n[font-size:14px]{valueY}';
      series.columns.template.maxWidth = 100;
      series.fill = am4core.color(color);
      series.stroke = am4core.color(color);

      series.xAxis.startLocation = 0.3;
      series.xAxis.endLocation = 0.7;

      series.stacked = true;
      series.columns.template.width = am4core.percent(50);
    }

    createSeries('completed', t('Completed'), '#8EC684');
    createSeries('in_progress', t('In Progress'), '#FFE019');
    createSeries('late', t('Late'), '#FF3766');

    // Add legend
    chart.legend = new am4charts.Legend();
    chart.legend.width = am4core.percent(100);
    chart.legend.contentAlign = 'left';

    chart.legend.useDefaultMarker = true;
    var marker: any = chart.legend.markers.template.children.getIndex(0)!;
    var marker_template = chart.legend.itemContainers.template;

    chart.legend.labels.template.text =
      "[font-size: 13px; font-family:'Muli'; font-weight: 600; #728393]{name}[/]";
    chart.legend.labels.template.dy = -4;
    chart.legend.labels.template.dx = -8;
    chart.legend.dy = -25;

    marker_template.hoverable = false;
    marker_template.clickable = false;

    marker.width = 12;
    marker.height = 12;
    marker.cornerRadius(12, 12, 12, 12);
    marker.strokeOpacity = 0;
    marker.hoverable = false;
    marker.clickable = false;

    return () => {
      chart.dispose();
    };
  }, [stats, isLoading, lang]);

  return chartRef;
}

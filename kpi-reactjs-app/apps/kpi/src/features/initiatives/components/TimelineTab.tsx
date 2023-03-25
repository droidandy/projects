import * as React from 'react';
import * as R from 'remeda';
import styled from 'styled-components';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { getInitiativesState } from '../interface';
import { Initiative } from 'src/types-next';
import { useTranslation } from 'react-i18next';
import { useLanguage } from 'src/hooks/useLanguage';
import { RouterActions } from 'typeless-router';
import { useActions } from 'typeless';

interface TimelineTabProps {
  className?: string;
}

interface InitiativeWithChildren extends Initiative {
  children: InitiativeWithChildren[];
}

am4core.useTheme(am4themes_animated);

const _TimelineTab = (props: TimelineTabProps) => {
  const { className } = props;
  const ref = React.useRef<HTMLDivElement>(null!);
  const lang = useLanguage();
  const { t } = useTranslation();
  const { push } = useActions(RouterActions);
  const { initiatives, initiativeId, items } = getInitiativesState.useState();

  const chartItems = React.useMemo(() => {
    if (!initiatives || !initiativeId) {
      return [];
    }
    const itemGroup = R.groupBy(items, x => x.initiativeItemId);
    const initiativesWithChildren: InitiativeWithChildren[] = initiatives.map(
      item => ({
        ...item,
        children: [],
      })
    );
    const idMap = R.indexBy(initiativesWithChildren, x => x.id);
    initiativesWithChildren.forEach(item => {
      if (item.parentId) {
        const parent = idMap[item.parentId];
        if (parent) {
          parent.children.push(item);
        }
      }
    });
    const target = initiativesWithChildren.find(x => x.id === initiativeId)!;
    const travel = (item: InitiativeWithChildren) => {
      const ret = [item];
      item.children.forEach(sub => {
        ret.push(...travel(sub));
      });
      return ret;
    };

    const nameMap: any = {};
    const usedMap: any = {};
    const colorSet = new am4core.ColorSet();
    colorSet.saturation = 0.4;
    let colorIndex = -1;
    return R.flatMap(travel(target), initiative => {
      colorIndex++;
      const initiativeItems = itemGroup[initiative.id] || [];
      const name = initiative.name[lang];
      if (!nameMap[initiative.id]) {
        if (!usedMap[name]) {
          usedMap[name] = 1;
        } else {
          usedMap[name]++;
        }
        const count = usedMap[name];
        nameMap[initiative.id] = name + (count === 1 ? '' : `#${count}`);
      }
      const sorted = [...initiativeItems].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      const getDate = (date: string) => date.split('T')[0];
      return sorted.map((item, i) => {
        const prev = sorted[i - 1];
        return {
          id: initiative.id,
          category: nameMap[initiative.id],
          start: prev ? getDate(prev.date) : getDate(initiative.startDate),
          end: getDate(item.date),
          color: colorSet.getIndex(colorIndex).brighten(i * 0.2),
          task: `${t('Spent')}: ${item.budgetSpent}, ${t('Progress')}: ${
            item.progressPercentage
          }%`,
        };
      });
    });
  }, [initiatives, initiativeId, items, lang]);

  React.useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }
    const chart = am4core.create(ref.current, am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.paddingRight = 30;
    chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd HH:mm';

    const colorSet = new am4core.ColorSet();
    colorSet.saturation = 0.4;

    chart.data = chartItems;

    chart.dateFormatter.dateFormat = 'yyyy-MM-dd';
    chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd';

    const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.id = 'id';
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.inversed = true;
    categoryAxis.clickable = true;

    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 70;
    dateAxis.baseInterval = { count: 1, timeUnit: 'day' };

    dateAxis.renderer.tooltipLocation = 0;

    const series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.columns.template.height = am4core.percent(70);
    series1.columns.template.tooltipText =
      '{task}: [bold]{openDateX}[/] - [bold]{dateX}[/]';

    series1.dataFields.openDateX = 'start';
    series1.dataFields.dateX = 'end';
    series1.dataFields.categoryY = 'category';
    series1.columns.template.propertyFields.fill = 'color'; // get color from data
    series1.columns.template.propertyFields.stroke = 'color';
    series1.columns.template.strokeOpacity = 1;

    series1.columns.template.clickable = true;
    series1.columns.template.events.on('hit', ev => {
      const item: any = ev.target.dataItem!.dataContext;
      push(`/initiatives/${item.id}`);
    });

    chart.scrollbarX = new am4core.Scrollbar();
  }, [chartItems]);

  return (
    <div
      className={className}
      ref={ref}
      style={{ height: initiatives.length * 50 + 100 }}
    ></div>
  );
};

export const TimelineTab = styled(_TimelineTab)`
  display: block;
  [role='menuitem'] {
    cursor: pointer;
  }
`;

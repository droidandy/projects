import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { ChartColor, FrequencyPeriod } from 'src/types';
import { Colors } from 'src/Const';

interface ChartItem {
  color: string;
  count: number;
}

interface PerformanceChartProps {
  items: ChartItem[];
  size: 'default' | 'large' | 'xlarge';
  defaultSelected: ChartColor;
  className?: string;
  type?: string;
  unit?: number | any;
  period?: FrequencyPeriod;
  units?: number[];
  responsibleUnit?: number;
}

function getPoint(center: number, deg: number, radius: number) {
  const cos = Math.cos((deg * Math.PI) / 180);
  const sin = Math.sin((deg * Math.PI) / 180);
  return {
    x: center + sin * radius,
    y: center + cos * radius,
  };
}

const Percent = styled.div<{ large: boolean }>`
  position: absolute;
  font-style: normal;
  font-weight: 800;
  text-align: center;
  color: #244159;
  font-style: normal;
  font-weight: 800;
  ${props =>
    props.large
      ? css`
          right: calc(50% - 50px);
          top: calc(50% - 20px);
          z-index: 1;
          width: 100px;
          height: 40px;
          font-size: 30px;
          line-height: 40px;
        `
      : css`
          right: calc(50% - 30px);
          top: calc(50% - 13px);
          z-index: 1;
          width: 60px;
          height: 26px;
          font-size: 20px;
          line-height: 25px;
        `}
`;

const largeSettings = {
  width: 250,
  height: 250,
  size: 30,
  padding: 15,
  selectedSize: 5,
};
const xlargeSettings = {
  width: 330,
  height: 330,
  size: 45,
  padding: 15,
  selectedSize: 5,
};
const defaultSettings = {
  width: 150,
  height: 150,
  size: 12,
  padding: 15,
  selectedSize: 5,
};

function round(v: number) {
  return Math.round(v * 100) / 100;
}

interface DefOptions {
  innerRadius: number;
  center: number;
  separatorDegrees: number;
  currentDeg: number;
  deg: number;
  radius: number;
  selectedSize: number;
  selected: boolean;
}

const getDef = (options: DefOptions) => {
  const {
    currentDeg,
    separatorDegrees,
    deg,
    center,
    selected,
    radius,
    innerRadius,
    selectedSize,
  } = options;
  const fromDeg = currentDeg + separatorDegrees;
  const toDeg = currentDeg + deg - separatorDegrees;
  const startInner = getPoint(center, fromDeg, innerRadius);
  const endInner = getPoint(center, toDeg, innerRadius);
  const outerRadius = selected ? radius + selectedSize : radius;
  const startOuter = getPoint(center, fromDeg, outerRadius);
  const endOuter = getPoint(center, toDeg, outerRadius);
  const large = deg > 180 ? 1 : 0;
  return [
    'M',
    startInner.x,
    startInner.y,
    'A',
    innerRadius,
    innerRadius,
    0,
    large,
    0,
    endInner.x,
    endInner.y,
    'L',
    endOuter.x,
    endOuter.y,
    'A',
    outerRadius,
    outerRadius,
    0,
    large,
    1,
    startOuter.x,
    startOuter.y,
    'Z',
  ].join(' ');
};

const getMarkDef = (options: DefOptions) => {
  const {
    currentDeg,
    separatorDegrees,
    deg,
    center,
    innerRadius,
    selectedSize,
  } = options;
  const markRadius = innerRadius - selectedSize;
  const fromDeg = currentDeg + separatorDegrees;
  const toDeg = currentDeg + deg - separatorDegrees;
  const startInner = getPoint(center, fromDeg, markRadius);
  const endInner = getPoint(center, toDeg, markRadius);
  const large = deg >= 180 ? 1 : 0;
  return [
    'M',
    startInner.x,
    startInner.y,
    'A',
    markRadius,
    markRadius,
    0,
    large,
    0,
    endInner.x,
    endInner.y,
    ,
  ].join(' ');
};

interface ChartSliceProps {
  selected: boolean;
  currentDeg: number;
  deg: number;
  fill: string;
  selectedSize: number;
  innerRadius: number;
  center: number;
  radius: number;
  separatorDegrees: number;
  onMouseEnter: () => any;
}

function ChartSlice(props: ChartSliceProps) {
  const {
    selected,
    currentDeg,
    fill,
    deg,
    onMouseEnter,
    center,
    separatorDegrees,
    radius,
    innerRadius,
    selectedSize,
  } = props;

  const pathRef = React.useRef(null as SVGPathElement | null);
  const selectedSizeTargetRef = React.useRef(selected ? selectedSize : 0);
  const currentSizeRef = React.useRef(0);

  const baseDefOptions = {
    currentDeg,
    separatorDegrees,
    deg,
    center,
    radius,
    innerRadius,
  };

  const markDef = getMarkDef({
    ...baseDefOptions,
    selected,
    selectedSize,
  });

  React.useLayoutEffect(() => {
    selectedSizeTargetRef.current = selected ? selectedSize : 0;
    let animateTimeoutId = 0;
    const animate = () => {
      const d = getDef({
        ...baseDefOptions,
        selected: true,
        selectedSize: currentSizeRef.current,
      });
      if (pathRef.current) {
        pathRef.current.setAttribute('d', d);
      }
      if (currentSizeRef.current !== selectedSizeTargetRef.current) {
        if (selected) {
          currentSizeRef.current++;
        } else {
          currentSizeRef.current--;
        }
        animateTimeoutId = requestAnimationFrame(animate);
      }
    };
    animate();
    return () => {
      cancelAnimationFrame(animateTimeoutId);
    };
  }, [selected]);

  return (
    <>
      <path ref={pathRef} fill={fill} onMouseEnter={onMouseEnter}></path>
      {selected && (
        <path fill="none" stroke={fill} strokeWidth="2" d={markDef}></path>
      )}
    </>
  );
}

const _PerformanceChart = (props: PerformanceChartProps) => {
  const { items, className, type, unit, period, units, responsibleUnit } = props;
  const [color, setColor] = useState('');
  const colorChartArray = Object.entries(Colors).find(el => {
    return el[1] === color;
  });
  const colorChart = colorChartArray ? colorChartArray[0] : null;
  const defaultSelected = props.defaultSelected.toLowerCase();
  const defaultIndex = React.useMemo(() => {
    const ret = items.findIndex(x => x.color.toLowerCase() === defaultSelected);
    return ret === -1 ? 0 : ret;
  }, []);
  const [selectedIndex, setSelectedIndex] = React.useState(defaultIndex);
  const { width, height, padding, size, selectedSize } =
    props.size === 'large'
      ? largeSettings
      : props.size === 'xlarge'
      ? xlargeSettings
      : defaultSettings;

  const radius = (width - padding) / 2;
  const innerRadius = radius - size;
  const center = width / 2;
  const separatorDegrees = items.length > 1 ? 1 : 0.1;
  const total = items.reduce((ret, item) => ret + item.count, 0);
  let currentDeg = 0;
  let url: string = '';

  type === 'KPI'
    ? Object.keys({ ...unit, ...period }).forEach((key: string) => {
        switch (key) {
          case 'id':
            url = `units=${unit![key]}&`;
            break;
          case 'frequency':
            url = url + `periodFrequency=${period![key]}&`;
            break;
          case 'periodNumber':
            url = url + `periodNumber=${period![key]}&`;
            break;
          case 'year':
            url = url + `year=${period![key]}&`;
            break;
          default:
            break;
        }
      })
    : null;

  if (type === 'KPI') {
    if (units) {
      url = url + `units=${units.join(',')}&`;
    }
    if (responsibleUnit) {
      url = url + `organizationId=${responsibleUnit}&`; 
    }
  }

  colorChart && type === 'KPI' ? (url = url + 'colors=' + colorChart) : '';


  return (
    <div className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
        <a
          onMouseEnter={e => {
            setColor(e.target!.attributes[0].value);
          }}
          href={
            type === 'KPI'
              ? url
                ? `/kpi-reports?${url}`
                : '/kpi-reports'
              : undefined
          }
          target="_blank"
        >
          {items.map((item, i) => {
            const deg = (item.count / total) * 360;
            const slice = (
              <ChartSlice
                selected={i === selectedIndex}
                key={i}
                fill={Colors[item.color.toLowerCase()]}
                onMouseEnter={() => {
                  setSelectedIndex(i);
                }}
                deg={deg}
                currentDeg={currentDeg}
                selectedSize={selectedSize}
                innerRadius={innerRadius}
                center={center}
                separatorDegrees={separatorDegrees}
                radius={radius}
              />
            );

            currentDeg += deg;
            return slice;
          })}
        </a>
      </svg>
      <Percent large={props.size === 'large'}>
        {items[selectedIndex]
          ? round((items[selectedIndex].count / total) * 100) + '%'
          : 'N/A'}
      </Percent>
    </div>
  );
};

export const PerformanceChart = styled(_PerformanceChart)`
  margin-top: auto;
  margin-bottom: auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    flex-shrink: 0;
  }
`;

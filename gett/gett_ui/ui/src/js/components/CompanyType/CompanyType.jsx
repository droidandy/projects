import React from 'react';
import { Tag } from 'antd';
import CN from 'classnames';
import css from './CompanyType.css';

const COLORS = {
  'enterprise': '#e1ebfb',
  'affiliate': '#fdd8e7',
  'bbc': '#fcdbda',
};

export default function CompanyType(companyType) {
  const color = COLORS[companyType];
  const value = companyType[0];
  return (
    <Tag className={ CN(css.companyType, 'layout horizontal center-center') } color={ color }>
      <span className={ CN(css.companyType, css[companyType], 'layout horizontal center-center') }>
        { value }
      </span>
    </Tag>
  );
}

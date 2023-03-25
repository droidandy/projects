import React from 'react';
import { FormGroup, Card, CardHeader, CardBody } from 'reactstrap';

import classes from './NodeView.module.css';

const fields = [
  {
    property: 'pcf_id',
    label: 'Pcf ID',
  },
  {
    property: 'difference_idx',
    label: 'Difference Idx',
  },
  {
    property: 'change_details',
    label: 'Change Details',
  },
  {
    property: 'metrics_avail',
    label: 'Metrics Avail',
  },
  {
    property: 'kpis',
    label: 'KPIs',
  },
];

const TreeNodeView = ({ node, title = '', kpilibs = [] }) => {
  return (
    <div className={classes.nodeView}>
      <Card className={classes.card}>
        <CardHeader>{title}</CardHeader>
        <CardBody>
          <FormGroup>{`${node.hierarchy_id || ''} ${node.name}`}</FormGroup>
          {fields.map(({ property, label }) => {
            let value = node[property];
            if (property === 'metrics_avail') {
              value = value ? 'Yes' : 'No';
            } else if (property === 'kpis') {
              const kpis = Array.from(kpilibs)
                .filter(it => Array.from(node.kpis || []).includes(String(it.id)))
                .map(it => it.label);
              return kpis && kpis.length ? (
                <FormGroup key={property}>
                  <div>{label}:</div>
                  <ol>
                    {kpis.map((kpi, index) => (
                      <li key={index}>{kpi}</li>
                    ))}
                  </ol>
                </FormGroup>
              ) : null;
            }
            return value ? (
              <FormGroup key={property}>
                {label}: {value}
              </FormGroup>
            ) : null;
          })}
        </CardBody>
      </Card>
    </div>
  );
};

export default TreeNodeView;

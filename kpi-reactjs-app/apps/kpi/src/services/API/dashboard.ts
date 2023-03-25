import { Dashboard } from 'src/types-next';
import { _getData, _mockResponse } from './_utils';

const initialData: Dashboard[] = [
  {
    id: 1,
    name: {
      ar: '[ar] Board Dashboard',
      en: 'Board Dashboard',
    },
    description: {
      ar: '[ar] description',
      en: 'description',
    },
    rows: [
      {
        id: 1,
        columns: [
          {
            id: 1,
            flex: 1,
            direction: 'row',
            widgets: [
              {
                id: 1,
                name: {
                  ar: '[ar] KPI Stats',
                  en: 'KPI Stats',
                },
                description: {
                  ar: '[ar] description',
                  en: 'description',
                },
                type: 'pie-chart',
                data: [
                  {
                    label: {
                      ar: '[ar] achieved',
                      en: 'achieved',
                    },
                    value: 20,
                  },
                  {
                    label: {
                      ar: '[ar] not achieved',
                      en: 'not achieved',
                    },
                    value: 10,
                  },
                  {
                    label: {
                      ar: '[ar] no results',
                      en: 'no results',
                    },
                    value: 15,
                  },
                ],
              },
            ],
          },
          {
            id: 2,
            flex: 1,
            direction: 'row',
            widgets: [
              {
                id: 2,
                name: {
                  ar: '[ar] Initiative Stats',
                  en: 'Initiative Stats',
                },
                description: {
                  ar: '[ar] description',
                  en: 'description',
                },
                type: 'pie-chart',
                data: [
                  {
                    label: {
                      ar: '[ar] achieved',
                      en: 'achieved',
                    },
                    value: 10,
                  },
                  {
                    label: {
                      ar: '[ar] not achieved',
                      en: 'not achieved',
                    },
                    value: 30,
                  },
                  {
                    label: {
                      ar: '[ar] no results',
                      en: 'no results',
                    },
                    value: 25,
                  },
                ],
              },
            ],
          },
          {
            id: 3,
            flex: 1,
            direction: 'row',
            widgets: [
              {
                id: 3,
                name: {
                  ar: '[ar] Dashboards Stats',
                  en: 'Dashboards Stats',
                },
                description: {
                  ar: '[ar] description',
                  en: 'description',
                },
                type: 'pie-chart',
                data: [
                  {
                    label: {
                      ar: '[ar] solved',
                      en: 'solved',
                    },
                    value: 25,
                  },
                  {
                    label: {
                      ar: '[ar] in progress',
                      en: 'in progress',
                    },
                    value: 15,
                  },
                  {
                    label: {
                      ar: '[ar] not solved',
                      en: 'not solved',
                    },
                    value: 25,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 2,
        columns: [
          {
            id: 1,
            flex: 2,
            direction: 'row',
            widgets: [
              {
                id: 1,
                name: {
                  ar: '[ar] Overall Performance',
                  en: 'Overall Performance',
                },
                description: {
                  ar: '[ar] description',
                  en: 'description',
                },
                label: {
                  ar: '[ar] Performance',
                  en: 'Performance',
                },
                type: 'line-chart',
                data: [
                  {
                    x: new Date(2019, 0, 1),
                    y: 10,
                  },
                  {
                    x: new Date(2019, 1, 1),
                    y: 20,
                  },
                  {
                    x: new Date(2019, 2, 1),
                    y: 30,
                  },
                  {
                    x: new Date(2019, 4, 1),
                    y: 15,
                  },
                  {
                    x: new Date(2019, 5, 1),
                    y: 25,
                  },
                ],
              },
            ],
          },
          {
            id: 2,
            flex: 1,
            direction: 'column',
            widgets: [
              {
                id: 1,
                name: {
                  ar: '[ar] Project Stats',
                  en: 'Project Stats',
                },
                description: {
                  ar: '[ar] description',
                  en: 'description',
                },
                label: {
                  ar: '[ar] Completed',
                  en: 'Completed',
                },
                type: 'area-chart',
                data: [
                  {
                    x: new Date(2019, 0, 1),
                    y: 10,
                  },
                  {
                    x: new Date(2019, 1, 1),
                    y: 55,
                  },
                  {
                    x: new Date(2019, 2, 1),
                    y: 30,
                  },
                  {
                    x: new Date(2019, 4, 1),
                    y: 22,
                  },
                  {
                    x: new Date(2019, 5, 1),
                    y: 4,
                  },
                ],
              },
              {
                id: 2,
                name: {
                  ar: '[ar] Strategic KPIs',
                  en: 'Strategic KPIs',
                },
                description: {
                  ar: '[ar] description',
                  en: 'description',
                },
                type: 'pie-chart',
                data: [
                  {
                    label: {
                      ar: '[ar] KPIs achieved',
                      en: 'KPIs achieved',
                    },
                    value: 20,
                  },
                  {
                    label: {
                      ar: '[ar] KPIs need action',
                      en: 'KPIs need action',
                    },
                    value: 10,
                  },
                  {
                    label: {
                      ar: '[ar] not achieved',
                      en: 'not achieved',
                    },
                    value: 10,
                  },
                  {
                    label: {
                      ar: '[ar] KPIs with no results',
                      en: 'KPIs with no results',
                    },
                    value: 15,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export function _getDashboards(): Dashboard[] {
  const dashboards = _getData<Dashboard>('data_dashboards', initialData);
  return dashboards;
}

export function getAllDashboards() {
  return _mockResponse(() => {
    return _getDashboards();
  });
}

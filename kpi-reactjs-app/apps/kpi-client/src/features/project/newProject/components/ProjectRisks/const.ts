export const getRisksSetting = (data: any[]) => {
  return [
    {
      value: data[0],
      align: 'right',
      width: '130px',
      padding: '3px',
    },
    {
      value: data[1],
      align: 'right',
      width: '130px',
      padding: '3px',
    },
    {
      value: data[2],
      align: 'right',
      width: 'calc(50% - 440px)',
      padding: '3px',
    },
    {
      value: data[3],
      align: 'center',
      width: '80px',
      padding: '3px',
    },
    {
      value: data[4],
      align: 'center',
      width: '80px',
      padding: '3px',
    },
    {
      value: data[5],
      align: 'center',
      width: '75px',
      padding: '3px',
    },
    {
      value: data[6],
      align: 'center',
      width: 'calc(50% - 380px)',
      padding: '3px',
    },
    {
      value: data[7],
      align: 'center',
      width: '120px',
      padding: '3px',
    },
    {
      value: data[8],
      align: 'center',
      width: '125px',
      padding: '3px',
    },
    {
      value: data[9],
      align: 'center',
      width: '80px',
      padding: '3px',
    },
  ];
};

export const defaultRisk = {
  id: -1,
  activity: undefined,
  type: undefined,
  description: '',
  probability: undefined,
  impact: undefined,
  counterMeasures: [],
  responsibility: undefined,
  timeline: [new Date(), new Date()],
};

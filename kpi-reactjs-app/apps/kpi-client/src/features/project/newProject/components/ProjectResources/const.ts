export const getBudgetPlanSetting = (data: any[]) => {
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
      width: 'calc(50% - 410px)',
      padding: '3px',
    },
    {
      value: data[2],
      align: 'center',
      width: '100px',
      padding: '3px',
    },
    {
      value: data[3],
      align: 'center',
      width: '90px',
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
      width: '80px',
      padding: '3px',
    },
    {
      value: data[6],
      align: 'center',
      width: '140px',
      padding: '3px',
    },
    {
      value: data[7],
      align: 'center',
      width: '125px',
      padding: '3px',
    },
    {
      value: data[8],
      align: 'center',
      width: 'calc(50% - 415px)',
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

export const getOtherResourcesSetting = (data: any[]) => {
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
      width: 'calc(25% - 110px)',
      padding: '3px',
    },
    {
      value: data[2],
      align: 'right',
      width: 'calc(25%)',
      padding: '3px',
    },
    {
      value: data[3],
      align: 'right',
      width: 'calc(25% - 100px)',
      padding: '3px',
    },
    {
      value: data[4],
      align: 'right',
      width: 'calc(25%)',
      padding: '3px',
    },
    {
      value: data[5],
      align: 'center',
      width: '80px',
      padding: '3px',
    },
  ];
};

export const defaultBudgetPlan = {
  id: -1,
  activity: undefined,
  details: '',
  financialItem: '',
  mainBudget: '',
  extraCost: '',
  totalCost: '',
  paymentProc: undefined,
  timeline: [new Date(), new Date()],
  comment: '',
};

export const defaultOtherResource = {
  id: -1,
  activity: undefined,
  resource: undefined,
  details: '',
  mainBudget: '',
  comment: '',
};

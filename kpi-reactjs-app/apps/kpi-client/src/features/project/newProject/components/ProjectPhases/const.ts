export const getMainPhaseSetting = (data: any[]) => {
  return [
    {
      value: data[0],
      align: 'right',
      width: 'calc(35% - 130px)',
    },
    {
      value: data[1],
      align: 'center',
      width: '140px',
    },
    {
      value: data[2],
      align: 'center',
      width: '140px',
    },
    {
      value: data[3],
      align: 'right',
      width: 'calc(30% - 130px)',
    },
    {
      value: data[4],
      align: 'right',
      width: 'calc(35% - 130px)',
    },
    {
      value: data[5],
      align: 'center',
      width: '110px',
    },
  ];
};

export const getCommunicationSetting = (data: any[]) => {
  return [
    {
      value: data[0],
      align: 'right',
      width: 'calc(33.33% - 150px)',
    },
    {
      value: data[1],
      align: 'right',
      width: 'calc(33.34% - 130px)',
    },
    {
      value: data[2],
      align: 'right',
      width: '180px',
    },
    {
      value: data[3],
      align: 'right',
      width: '140px',
    },
    {
      value: data[4],
      align: 'right',
      width: 'calc(33.33% - 150px)',
    },
    {
      value: data[5],
      align: 'center',
      width: '110px',
    },
  ];
};

export const defaultMainPhase = {
  id: -1,
  name: '',
  startDate: new Date(),
  endDate: new Date(),
  outcome: '',
  comment: '',
};

export const defaultCommunication = {
  id: -1,
  message: '',
  audience: '',
  channel: undefined,
  frequency: undefined,
  efficiency: '',
};

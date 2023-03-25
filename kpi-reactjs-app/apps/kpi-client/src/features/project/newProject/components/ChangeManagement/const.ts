export const getChangeManagementSetting = (data: any[]) => {
  return [
    {
      value: data[0],
      align: 'right',
      width: 'calc(33% - 160px)',
      padding: '3px',
    },
    {
      value: data[1],
      align: 'center',
      width: 'calc(33% - 160px)',
      padding: '3px',
    },
    {
      value: data[2],
      align: 'center',
      width: '120px',
      padding: '3px',
    },
    {
      value: data[3],
      align: 'right',
      width: '130px',
      padding: '3px',
    },
    {
      value: data[4],
      align: 'center',
      width: 'calc(34% - 135px)',
      padding: '3px',
    },
    {
      value: data[5],
      align: 'center',
      width: '125px',
      padding: '3px',
    },
    {
      value: data[6],
      align: 'center',
      width: '80px',
      padding: '3px',
    },
  ];
};

export const defaultChangemanagement = {
  id: -1,
  needForChange: '',
  description: '',
  changeScope: undefined,
  affectedParties: undefined,
  requiredAction: [],
  timeline: [new Date(), new Date()],
};

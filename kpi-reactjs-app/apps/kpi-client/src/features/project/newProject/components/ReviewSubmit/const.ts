export const formatDate = (date: Date) => {
  return (
    (date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) +
    '/' +
    (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
    '/' +
    date.getFullYear()
  );
};

export const getUserManagementSetting = (data: any[]) => {
  return [
    {
      value: data[0],
      align: 'right',
      width: '75%',
    },
    {
      value: data[1],
      align: 'center',
      width: '25%',
    },
  ];
};

export const getMainPhaseSetting = (data: any[]) => {
  return [
    {
      value: data[0],
      align: 'right',
      width: 'calc(35% - 70px)',
    },
    {
      value: data[1],
      align: 'center',
      width: '120px',
    },
    {
      value: data[2],
      align: 'center',
      width: '120px',
    },
    {
      value: data[3],
      align: 'center',
      width: 'calc(30% - 100px)',
    },
    {
      value: data[4],
      align: 'right',
      width: 'calc(35% - 70px)',
    },
  ];
};

export const getCommunicationSetting = (data: any[]) => {
  return [
    {
      value: data[0],
      align: 'right',
      width: 'calc(33.33% - 140px)',
    },
    {
      value: data[1],
      align: 'right',
      width: 'calc(33.34% - 120px)',
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
      width: '90px',
    },
  ];
};

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
      width: 'calc(50% - 400px)',
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
      width: '180px',
      padding: '3px',
    },
    {
      value: data[8],
      align: 'center',
      width: 'calc(50% - 400px)',
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
      width: 'calc(25% - 70px)',
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
      width: 'calc(25% - 60px)',
      padding: '3px',
    },
    {
      value: data[4],
      align: 'right',
      width: 'calc(25%)',
      padding: '3px',
    },
  ];
};

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
      width: 'calc(50% - 400px)',
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
      width: '80px',
      padding: '3px',
    },
    {
      value: data[6],
      align: 'center',
      width: 'calc(50% - 400px)',
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
      width: '180px',
      padding: '3px',
    },
  ];
};

export const getChangeManagementSetting = (data: any[]) => {
  return [
    {
      value: data[0],
      align: 'right',
      width: 'calc(33% - 150px)',
      padding: '3px',
    },
    {
      value: data[1],
      align: 'center',
      width: 'calc(33% - 150px)',
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
      width: 'calc(34% - 130px)',
      padding: '3px',
    },
    {
      value: data[5],
      align: 'center',
      width: '180px',
      padding: '3px',
    },
  ];
};

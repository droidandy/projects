export const getUserManagementSetting = (data: any[]) => {
  return [
    {
      value: data[0],
      align: 'right',
      width: '50%',
    },
    {
      value: data[1],
      align: 'center',
      width: 'calc(50% - 120px)',
    },
    {
      value: data[2],
      align: 'left',
      width: '120px',
    },
  ];
};

export const defaultMember = {
  id: -1,
  orgUserId: -1,
  username: '',
  role: '',
  roleId: -1,
};

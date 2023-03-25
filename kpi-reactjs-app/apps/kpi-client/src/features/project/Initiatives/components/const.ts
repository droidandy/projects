export const formatDate = (date: Date) => {
  if (!date) return '';
  return (
    (date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) +
    '/' +
    (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
    '/' +
    date.getFullYear()
  );
};
export const getListingFilterSetting = (data: any[]) => {
  return [
    {
      value: data[0],
      align: 'right',
      width: '50px',
      padding: '5px',
      fontWeight: 'bold',
    },
    {
      value: data[1],
      align: 'left',
      width: '50px',
      padding: '5px',
      fontWeight: 'bold',
    },
    {
      value: data[2],
      align: 'right',
      width: '200px',
      padding: '5px',
      fontWeight: 'bold',
    },
    {
      value: data[3],
      align: 'left',
      width: '100px',
      padding: '5px',
      fontWeight: 'bold',
    },
    {
      value: data[4],
      align: 'right',
      width: '150px',
      padding: '5px',
      fontWeight: 'bold',
    },
    {
      value: data[5],
      align: 'left',
      width: '50px',
      padding: '5px',
      fontWeight: 'bold',
    },
    {
      value: data[6],
      align: 'right',
      width: '170px',
      padding: '5px',
      fontWeight: 'bold',
    },
    {
      value: data[7],
      align: 'left',
      width: '50px',
      padding: '5px',
      fontWeight: 'bold',
    },
    {
      value: data[8],
      align: 'right',
      width: '150px',
      padding: '5px',
      fontWeight: 'bold',
    },
  ];
};
export const getListingPageSetting = (data: any[]) => {
  return [
    {
      value: data[0],
      align: 'right',
      width: 'calc(50% - 250px)',
      padding: '3px',
    },
    {
      value: data[1],
      align: 'right',
      width: '120px',
      padding: '3px',
    },
    {
      value: data[2],
      align: 'center',
      width: '80px',
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
      width: '90px',
      padding: '3px',
    },
    {
      value: data[5],
      align: 'center',
      width: '130px',
      padding: '20px',
    },
    {
      value: data[6],
      align: 'right',
      width: 'calc(50% - 260px)',
      padding: '3px',
    },
  ];
};

import { EDSortDirection } from '@invest.wl/core';

export class VSortXI18n {
  public static direction: { [D in EDSortDirection]: string } = {
    [EDSortDirection.Asc]: 'По возрастанию',
    [EDSortDirection.Desc]: 'По убыванию',
    [EDSortDirection.None]: 'Отсутствует',
  };
}

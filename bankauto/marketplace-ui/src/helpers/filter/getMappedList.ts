import { NodeId } from '@marketplace/ui-kit/types';

export const getMappedList = <ListType extends NodeId>(ids: string | string[], entities: ListType[]) => {
  if (entities.length === 0) {
    return [];
  }

  // const valuesMap = entities.reduce((acc: Record<number, string>, value: ListType) => {
  //   if (!acc[value.id]) {
  //     acc[value.id] = value.name;
  //   }

  //   return acc;
  // }, {});

  return Array.isArray(ids) ? ids.map((id) => ({ value: +id })) : [{ value: +ids }];
};

import { LinkItemDto } from 'types/dtos/links.dto';
import { LinkItem } from '@marketplace/ui-kit/types';
import { LinksMapper } from './mappers/links.mapper';
import API, { DIR_URL } from '../config';

type Query = {
  path: string;
};

export const getLinksList = async (params: any): Promise<LinkItem[]> => {
  const query: Query = {
    ...params,
  };

  return API.get<LinkItemDto[]>('/v1/links/list', query, {
    baseURL: DIR_URL,
  }).then((res) => LinksMapper(res.data));
};

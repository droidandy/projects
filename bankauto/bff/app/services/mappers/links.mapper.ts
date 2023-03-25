import { LinkItemDto } from 'types/dtos/links.dto';
import { LinkItem } from '@marketplace/ui-kit/types';

export const LinkMapper = <T>(item: T, dto: LinkItemDto): T & LinkItem => {
  return {
    ...item,
    id: dto.id,
    title: dto.title,
    desc: dto.description ?? '',
    iconVariant: dto.icon,
    link: dto.link,
  };
};

export const LinksMapper = (links: LinkItemDto[]): LinkItem[] => {
  return links.map((link) => LinkMapper({}, link));
};

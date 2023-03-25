import { BlogPostAuthor } from '@marketplace/ui-kit/types';

export const getAuthorFullName = (author: BlogPostAuthor) => {
  return `${author.name} ${author.surname}`;
};

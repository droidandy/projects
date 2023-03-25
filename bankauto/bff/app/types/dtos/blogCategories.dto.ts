export type BlogCategoryDTO = {
  id: number;
  alias: string;
  name: string;
  parent_id: null | number;
};

export type BlogCategoriesDTO = BlogCategoryDTO[];

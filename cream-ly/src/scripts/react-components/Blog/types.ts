export interface AuthorV2 {
  name: string;
  bio: null;
}

export interface PostBlog {
  url: string;
  handle: string;
  title: string;
}

export interface PostSeo {
  description: string;
  title: string;
}

export interface PostImage {
  id: string;
  originalSrc: string;
  transformedSrc: string;
}

export interface PostProps {
  id: string;
  url: string;
  title: string;
  handle: string;
  tags: string[];
  authorV2: AuthorV2;
  excerptHtml: string;
  contentHtml: string;
  excerpt: string;
  seo: PostSeo;
  blog: PostImage;
  image: PostImage | null;
}

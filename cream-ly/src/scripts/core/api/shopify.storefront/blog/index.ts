//@ts-nocheck
import gql from "graphql-tag";
import { grahqlFetch } from "../";
import storeFrontArticlesData from "./cache/articles.list";

export const blogArticles = storeFrontArticlesData.articles.edges.map((element) => element.node)

export const articleHandles = blogArticles.map(({ handle }) => handle);

const queryGetArticles = gql`
  {
    articles(first: 100, reverse: true) {
      edges {
        node {
          id
          url
          title
          handle
          tags
          image(crop: CENTER, maxHeight: 300, maxWidth: 300) {
            transformedSrc
            originalSrc
          }
          authorV2 {
            name
            bio
          }
          excerptHtml
          contentHtml
          excerpt
          seo {
            description
            title
          }
          blog {
            url
            handle
            title
          }
        }
      }
    }
  }
`;

export const fetchArticles = (): Shopify.Storefront.IResponseBlogArticles => {
  return grahqlFetch(queryGetArticles).then((response) => {
    if (!response)
      throw Error(
        "no response from products graphql. check if fetch method is mocked maybe"
      );
    if (response.errors)
      throw Error(
        "errors in graphql request " + JSON.stringify(response.errors)
      );

    return response.data as Shopify.Storefront.IResponseBlogArticles;
  });
};

export const getFromStorage = (key) => {
  const storedObject = localStorage.getItem(key);
  if (!storedObject) return null;

  let parsedObject = null;

  try {
    parsedObject = JSON.parse(storedObject);
  } catch (e) {
    return null;
  }

  return parsedObject;
};

const needUpdate = () => {
  const savedTimestamp = getFromStorage("lastCacheUpdate");
  if (savedTimestamp) {
    const diffInMinutes = (Date.now() - savedTimestamp) / (1000 * 60);
    return diffInMinutes > 10;
  }
  return true;
};

export const getArticles = async () => {
  const blogPages = window.location.pathname.includes("blogs/beauty");
  const defaultArticles = blogArticles;

  if (!blogPages) {
    return defaultArticles;
  }

  if (needUpdate()) {
    try {
      const fetchedArticles = await fetchArticles();
      localStorage.setItem("articles", JSON.stringify(fetchedArticles));
      localStorage.setItem("lastCacheUpdate", JSON.stringify(Date.now()));
      return fetchedArticles.articles.edges.map((element) => element.node);
    } catch (error) {
      return defaultArticles;
    }
  } else {
    const articlesFromStorage = getFromStorage("articles");
    return articlesFromStorage
      ? articlesFromStorage.articles.edges.map((element) => element.node)
      : defaultArticles;
  }
};

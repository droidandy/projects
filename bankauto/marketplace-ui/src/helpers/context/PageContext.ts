import { createContext, useContext } from 'react';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getAbsoluteUrl, getFullPathname } from 'helpers/getAbsoluteUrl';

export type PageContextType<Q extends ParsedUrlQuery = ParsedUrlQuery> = {
  canonical: string;
  isCanonical: boolean;
  isMobileDevice: boolean;
  isiOS: boolean;
  isAndroid: boolean;
  userAgent?: any;
  params: Q;
  query: ParsedUrlQuery;
};

export const pageContextDefault: PageContextType = {
  canonical: '',
  isCanonical: false,
  isMobileDevice: false,
  isiOS: false,
  isAndroid: false,
  params: {},
  query: {},
};

export const PageContext = createContext<PageContextType>(pageContextDefault);

export interface GetPageContextValues<Q extends ParsedUrlQuery = ParsedUrlQuery> {
  context: GetServerSidePropsContext<Q>;
  basePath?: string;
}

const getCanonicalInfo = (context: GetServerSidePropsContext<ParsedUrlQuery>, basePath?: string) => {
  let isCanonical = Object.keys(context.query).every((item) => item === 'slug') || !Object.keys(context.query).length;
  let canonical = basePath ? `${getAbsoluteUrl(context.req)}${basePath}` : getFullPathname(context.req);

  if (context.query.slug && context.query.slug[0] === 'car-used') {
    isCanonical = false;
    canonical = `${getAbsoluteUrl(context.req)}/car/used/`;
  }

  return {
    isCanonical,
    canonical,
  };
};

export const getPageContextValues = <Q extends ParsedUrlQuery = ParsedUrlQuery>({
  context,
  basePath,
}: GetPageContextValues<Q>): PageContextType<Q> => {
  const isMobile = !!context.req.headers['user-agent']?.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
  );
  const isiOS = !!context.req.headers['user-agent']?.match(/iPhone|iPad/i);
  const isAndroid = !!context.req.headers['user-agent']?.match(/Android/i);

  return {
    ...getCanonicalInfo(context, basePath),
    userAgent: context.req.headers['user-agent'],
    isMobileDevice: isMobile,
    isiOS,
    isAndroid,
    params: context.params || ({} as Q),
    query: context.query,
  };
};

export const usePageContext = <C extends ParsedUrlQuery = ParsedUrlQuery>() => {
  const context = useContext(PageContext);
  return context as PageContextType<C>;
};

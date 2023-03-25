export const removePageParam = (url: string): string => {
  const [path, query] = url.split('?');
  if (!query || (query && !query.includes('page'))) return url;

  const pagelessQuery = query.includes('&')
    ? `?${query
        .split('&')
        .filter((item) => !item.includes('page'))
        .join('&')}`
    : '';

  return `${path}${pagelessQuery}`;
};

export const getPagedUrl = (url: string, page: number) => {
  const pagelessUrl = removePageParam(url);
  const hasQueryParams = pagelessUrl.includes('?');
  const pagePrefix = hasQueryParams ? '&' : '?';
  return `${pagelessUrl}${pagePrefix}page=${page}`;
};

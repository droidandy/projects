const httpPattern = /^https?:\/\//;

export const isValidLogosObject = (arg: Record<string, string | null>): boolean => {
  let result = false;
  try {
    const maybeLogos = [
      arg.logo, arg.logoNormal, arg.logoOriginal, arg.logoSquare, arg.logoSquareStrict, arg.logoThumbnail,
    ];

    const httpLinkOrNull = (oneLogo: string | null): boolean => oneLogo === null || oneLogo.match(httpPattern).length > 0;
    const httpLinksOrNulls = maybeLogos.every(httpLinkOrNull);

    const atLeastOneLink = maybeLogos.some((i) => Boolean(i));

    result = httpLinksOrNulls && atLeastOneLink;
  } catch (e) {
    result = false;
  }
  if (!result) console.log('not a valid logos object: ', arg);
  return result;
};

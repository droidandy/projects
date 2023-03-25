function isCrawler(userAgent: string): boolean {
  userAgent = userAgent.toLowerCase();
  return userAgent.search('yandex') !== -1 || userAgent.search('google') !== -1;
}

export { isCrawler };

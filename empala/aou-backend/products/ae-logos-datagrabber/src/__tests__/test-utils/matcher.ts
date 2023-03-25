const httpPattern = /^https?:\/\//;
expect.extend({
  httpLinkOrNull: (arg: string) => {
    const pass = arg === null || arg.match(httpPattern).length > 0;
    const msg = pass ? 'passed' : `expected http link or null, received ${arg}`;
    return {
      pass,
      message: () => msg,
    };
  },
});

export const matcher = (expect as unknown as { httpLinkOrNull: () => any }).httpLinkOrNull();

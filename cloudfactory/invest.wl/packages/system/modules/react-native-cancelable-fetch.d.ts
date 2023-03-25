declare module 'react-native-cancelable-fetch' {

  interface Fetch {
    (url: string, opts: RequestInit, reqId: any): Promise<Response>;
    abort(reqId: any): void;
  }

  const fetch: Fetch;
  export default fetch;
}

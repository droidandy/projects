interface Config {
  domain: string;
  apiToken: string;
  apiVersion: string;
}

export default (): Config => ({
  domain: "creamly.myshopify.com",
  apiToken: "84e1f4ecfa045b516cfa8b8b293bbb13",
  apiVersion: "2021-04",
});

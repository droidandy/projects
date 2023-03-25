interface StringValues {
  readonly [key: string]: string;
}

interface STransportConfigApiResponse {
  readonly api: StringValues;
}

export type ISTransportConfigResponse = StringValues & STransportConfigApiResponse;

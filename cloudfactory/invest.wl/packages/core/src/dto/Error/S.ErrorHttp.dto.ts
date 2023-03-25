import { ISErrorDTO } from './S.Error.dto';

export interface ISErrorHttpDTO extends ISErrorDTO {
  // http status
  httpStatus: number;
  // http status or server status (if http === 200)
  status: number | string;
  // requested url
  url: string;
  // error response body is as
  body: any;
}

import { HttpErrorResponse } from '@angular/common/http';
import { IVersion } from '@shared/types/version';
import { Observable } from 'rxjs';


export const InitialApi: Api = {
  version: null,
  uri: "localhost:1951",
  connection: {
    api: true,
    client: true,
  },
  loading: null,
  error: null,
};

export interface ApiStatus {
  code: number;
  text: string;
}

export interface APIErrorResponse extends HttpErrorResponse {
  error: {
    message: string;
    additionalData?: { [key: string]: any };
  };
}

export interface Request<T> {
  name: string;
  resolvers?: ((value: T) => void)[];
  rejecters?: ((error: APIErrorResponse) => void)[];
  observable: Observable<T>;
}

export class Api {
  version: IVersion;
  uri: string;
  connection: {
    api: boolean;
    client: boolean;
  };
  loading: string;
  error: ApiStatus;
}

export class APIErrorResponseModel extends HttpErrorResponse implements APIErrorResponse {
  constructor(init: any) {
    super(init);
  }
}

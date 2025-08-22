export interface BasicHttpResponse {
  message: string;
  success: boolean;
}

export interface ResponseWithData<T = unknown> extends BasicHttpResponse {
  data: T;
}


export type DBCodeType = "SUCCESS" | "ERROR_DB" | "NOT_FOUND" | "BANNED_ACCOUNT";

export interface BasicHttpResponse<TCode = string> {
  message?: string;
  success: boolean;
  code?: TCode;
}

export interface ResponseWithData<TData = unknown, TCode = string>
  extends BasicHttpResponse<TCode> {
  data: TData;
}

import type { ContactFieldErrors } from "@/lib/validation/contact";

export type IContactErrorCode =
  | "INVALID_BODY"
  | "VALIDATION_FAILED"
  | "TURNSTILE_FAILED"
  | "RATE_LIMITED"
  | "PAYLOAD_TOO_LARGE"
  | "EMAIL_SEND_FAILED"
  | "SERVER_ERROR";

export interface IContactSuccessResponse {
  ok: true;
  requestId: string;
}

export interface IContactErrorResponse {
  ok: false;
  code: IContactErrorCode;
  message: string;
  requestId: string;
  fieldErrors?: ContactFieldErrors;
}

export type IContactResponse = IContactSuccessResponse | IContactErrorResponse;

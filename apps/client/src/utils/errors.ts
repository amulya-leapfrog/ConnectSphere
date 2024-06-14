import { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
}

export function getErrorMessage(err: AxiosError) {
  return (err.response?.data as ErrorResponse).message;
}

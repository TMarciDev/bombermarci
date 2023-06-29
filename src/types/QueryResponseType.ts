import { SocketResponse } from "@backend/types/AcknowledgementType";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

export type QueryResponse =
  | { data: SocketResponse }
  | { error: FetchBaseQueryError | SerializedError };

export interface RespWrapper<T> {
  result: T;
}

export interface RespWrapperWithPrev<T> extends RespWrapper<T> {
  prevResult: T;
}

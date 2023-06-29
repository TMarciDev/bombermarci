export type LoadingData<T> = { result: T } | undefined;
//export type LoadingDataWithPrev<T> = { result: T; prevResult: T } | undefined;
export interface LoadedData<T> {
  result: T;
}

export interface LoadedDataWithPrev<T> {
  prevResult: T;
}

export interface LoadedDataWithPrev<T> extends LoadedData<T> {
  prevResult: T;
}

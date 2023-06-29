import {
  LoadingData,
  LoadedData,
  LoadedDataWithPrev,
} from "../../types/DataHandleType";

/**
 * Checks if a query data is loaded
 * @param data The data to check
 * @returns True if it is loaded
 */
export const isLoaded = <T>(data: LoadingData<T>): boolean => {
  if (data) {
    return "result" in data;
  }
  return false;
};

/**
 * Gets the result from the query
 * @param data The raw data
 * @returns The extaracted data
 */
export const getResult = <T>(data: LoadedData<T>): T => {
  return data?.result;
};

/**
 * Gets the prevous results
 * @param data The data with the previous result
 * @returns The previous result
 */
export const getPrevResult = <T>(data: LoadedDataWithPrev<T>): T => {
  return data?.prevResult;
};

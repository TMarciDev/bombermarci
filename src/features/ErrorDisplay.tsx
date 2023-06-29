import { useListenToErrorsQuery } from "../app/services/errorDisplay";

/**
 * Subscribes for the error display service
 * @returns React fragment
 */
const ErrorDisplay = () => {
  useListenToErrorsQuery();
  return <></>;
};

export default ErrorDisplay;

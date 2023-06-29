import { QueryResponse } from "../../types/QueryResponseType";

/**
 * handles the response form the server
 * @param response The server response
 * @param action The action to be taken when the response is succesful
 */
export const handleResponseNavigation = (
  response: QueryResponse,
  action: () => void
) => {
  if ("data" in response && response.data.status === "ok") {
    action();
  }
};

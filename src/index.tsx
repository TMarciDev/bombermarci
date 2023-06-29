import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./styles/global.scss";

const container = document.getElementById("root")!;
const root = createRoot(container);

// <- loading users from the index when the app starts
// store.dispatch(fetchUsers())
//<React.StrictMode>
//</React.StrictMode>

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

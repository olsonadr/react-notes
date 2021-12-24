import React from "react";
import ReactDOM from "react-dom";
import "./styles/reset.css";
import "./styles/root.css";
import "./styles/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Auth0Provider } from "@auth0/auth0-react";

// Get Auth0 variables from environment
const authDomain =
  process.env.REACT_APP_AUTH0_DOMAIN !== undefined
    ? process.env.REACT_APP_AUTH0_DOMAIN
    : "";
const authClientId =
  process.env.REACT_APP_AUTH0_CLIENT_ID !== undefined
    ? process.env.REACT_APP_AUTH0_CLIENT_ID
    : "";

// Render the react app
ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={authDomain}
      clientId={authClientId}
      redirectUri={`${window.location.origin}/auth`}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

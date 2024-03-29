import React from "react";
import ReactDOM from "react-dom";
import "./styles/reset.css";
import "./styles/root.css";
import "./styles/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TOS from "./routes/tos";
import Privacy from "./routes/privacy";

// Get Auth0 variables from environment
const authDomain =
  process.env.NODE_ENV === 'development'
    ? window.env.REACT_APP_AUTH0_DOMAIN
    : process.env.REACT_APP_AUTH0_DOMAIN
    ?? "";
const authClientId =
  process.env.NODE_ENV === 'development'
    ? window.env.REACT_APP_AUTH0_CLIENT_ID
    : process.env.REACT_APP_AUTH0_CLIENT_ID
    ?? "";

// Render the react app
ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={authDomain}
      clientId={authClientId}
      redirectUri={window.location.origin}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/docs/tos" element={<TOS />} />
          <Route path="/docs/privacy" element={<Privacy />} />
          <Route path="/*" element={<App />} />
          {/* <Route path="/" element={<App defaultRetry={true}/>} /> */}
        </Routes>
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

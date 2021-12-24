import React, { useState } from "react";
import styled from "@emotion/styled";
import { useAuth0 } from "@auth0/auth0-react";
import "./styles/App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MainPanel from "./components/MainPanel";

// Styled elements
const AppComp = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

// Exported App react component
function App() {
  const [ sidebar, setSidebar ] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth0();

  return (
    <AppComp>
      <Navbar setSidebar={setSidebar} sidebar={sidebar} user={user} auth={isAuthenticated} loading={isLoading} />
      <Sidebar setSidebar={setSidebar} sidebar={sidebar} user={user} auth={isAuthenticated} loading={isLoading} />
      <MainPanel setSidebar={setSidebar} sidebar={sidebar} user={user} auth={isAuthenticated} loading={isLoading} />
    </AppComp>
  );
}

export default App;

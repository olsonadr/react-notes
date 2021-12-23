import React, { useState } from "react";
import styled from "@emotion/styled";
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
  const [sidebar, setSidebar] = useState(false);

  return (
    <AppComp>
      <Navbar setSidebar={setSidebar} sidebar={sidebar} />
      <Sidebar setSidebar={setSidebar} sidebar={sidebar} />
      <MainPanel setSidebar={setSidebar} sidebar={sidebar} />
    </AppComp>
  );
}

export default App;

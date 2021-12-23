import React, { useState } from "react";
import "./styles/App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MainPanel from "./components/MainPanel";

function App() {
  const [sidebar, setSidebar] = useState(false);

  return (
    <div className="App">
      <Navbar
        setSidebar={setSidebar}
        sidebar={sidebar}
        />
      <Sidebar
        setSidebar={setSidebar}
        sidebar={sidebar} />
      <MainPanel
        setSidebar={setSidebar}
        sidebar={sidebar}
        />
    </div>
  );
}



export default App;

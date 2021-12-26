import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useAuth0 } from "@auth0/auth0-react";
import io from "socket.io-client";
import "./styles/App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MainPanel from "./components/MainPanel";
import { Profile } from "./interfaces";

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
  // States of App
  const [sidebar, setSidebar] = useState(false);
  const [socket, setSocket] = useState<any>(undefined);
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [profile, setProfile] = useState<Profile | undefined>(undefined);

  // useEffect hook to handle socket opening, init messages, and cleanup closing
  useEffect(() => {
    // Create new connection
    console.log(`Trying to connect to ${window.location.host}`);
    const newSocket = io(
      `${window.location.host}`,
      {
        reconnectionDelay: 1000,
        reconnection: true,
        transports: ["websocket"],
        agent: false,
        upgrade: false,
        rejectUnauthorized: false,
      }
    );
    setSocket(newSocket);

    // Cleanup callback
    return () => {
      newSocket.close();
      return;
    };
  }, [setSocket]);

  // useEffect hook to send profile requests on user and isAuthenticated updates
  useEffect(() => {
    // Socket profile request message handlers
    if (socket) {
      // If authenticated, request profile information
      if (user && isAuthenticated) {
        console.log('Sending profile request!');
        socket.emit("profile_request", {
          email: user.email,
          name: user.name,
          picture: user.picture,
          user_id: user.sub,
        });
      }
      // Auth confirmation with profile information
      socket.on("profile_response", (msg:Profile) => {
        console.log('Received profile response!');
        setProfile(msg);
      });
    }

    // Return no cleanup
    return ()=>{return;};
  }, [user, isAuthenticated, socket]);

  // Return App component jsx
  return (
    <AppComp>
      <Navbar
        setSidebar={setSidebar}
        sidebar={sidebar}
        user={user}
        auth={isAuthenticated}
        loading={isLoading}
        profile={profile}
      />
      <Sidebar
        setSidebar={setSidebar}
        sidebar={sidebar}
        user={user}
        auth={isAuthenticated}
        loading={isLoading}
        profile={profile}
      />
      <MainPanel
        setSidebar={setSidebar}
        sidebar={sidebar}
        user={user}
        auth={isAuthenticated}
        loading={isLoading}
        socket={socket}
        profile={profile}
      />
    </AppComp>
  );
}

export default App;

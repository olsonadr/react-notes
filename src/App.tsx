import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useAuth0 } from "@auth0/auth0-react";
import io from "socket.io-client";
import "./styles/App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MainPanel from "./components/MainPanel";
import { Profile, Note } from "./interfaces";

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
  const [sidebar, setSidebar] = useState(true);
  const [[socket], setSocket] = useState<any>([undefined]);
  const [connected, setConnected] = useState<boolean>(false);
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [currNote, setCurrNote] = useState<Note | undefined>(undefined);

  // Refs of App (mutable vals)
  const profileRequestSent = useRef(false);
  const retrySocket = useRef(false);

  // useEffect hook to handle socket opening, init messages, and cleanup closing
  useEffect(() => {
    // Create new connection
    const URL = process.env.REACT_APP_DEV_PORT
      ? `:${process.env.REACT_APP_DEV_PORT}/`
      : `${window.location.host}`;
    // ? `${window.location.hostname}:${process.env.REACT_APP_PORT}`
    // const URL = `${window.location.hostname}:5000/api`;
    // const URL = `/`;
    console.log(`Trying to connect to ${URL}`);
    const newSocket = io(URL, {
      reconnectionDelay: 1000,
      reconnection: true,
      transports: ["websocket"],
      agent: false,
      upgrade: false,
      rejectUnauthorized: false,
    });
    setSocket([newSocket]);

    // Cleanup callback
    return () => {
      newSocket.close();
      return;
    };
  }, [setSocket]);
  
  // useEffect hook to connect socket once created
  useEffect(() => {
    // When socket is created, setup handlers
    if (socket) {
      // Auth confirmation with profile information
      socket.on("connected", () => {
        console.log("Connected to backend!");
        setConnected(true);
        if (profileRequestSent.current === true) {
          profileRequestSent.current = false;
          retrySocket.current = true;
        }
      });
    }
  }, [socket]);

  // useEffect hook to setup socket handlers once it is connected
  useEffect(() => {
    // When socket is created, setup handlers
    if (socket) {
      // Auth confirmation with profile information
      socket.on("profile_response", (msg: Profile) => {
        console.log("Received profile response!");
        setProfile(msg);
      });
      // Profile refresh handler
      socket.on("profile_refresh", (msg: Profile) => {
        console.log("Received profile refresh request!");
        setProfile(msg);
      });
      // Note redirect handler
      socket.on("note_redirect", (msg: { note_id: number }) => {
        console.log(`Received redirect request for note ${msg.note_id}!`);
        if (profile && profile.notes) {
          let notes_with_id = profile.notes.filter((obj) => {
            return obj.note_id === msg.note_id;
          });
          if (notes_with_id && notes_with_id.length > 0) {
            setCurrNote(notes_with_id[0]);
          }
        }
      });
    }
  }, [socket, profile, currNote]);

  // useEffect hook to send profile requests on user and isAuthenticated updates
  useEffect(() => {
    // Reset retry prompter
    retrySocket.current = false;

    // Socket profile request message handlers
    if (socket) {
      // If connected and authenticated, request profile information
      if (
        connected === true &&
        user &&
        isAuthenticated &&
        !profileRequestSent.current
      ) {
        console.log("Sending profile request!");
        socket.emit("profile_request", {
          email: user.email,
          name: user.name,
          picture: user.picture,
          user_id: user.sub,
        });
        profileRequestSent.current = true;
      }
    } else {
      // If disconnected, reset profileRequestSent
      profileRequestSent.current = false;
    }

    // Return no cleanup
    return () => {
      return;
    };
  }, [socket, connected, isAuthenticated, user]);

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
        socket={socket}
      />
      <Sidebar
        setSidebar={setSidebar}
        sidebar={sidebar}
        user={user}
        auth={isAuthenticated}
        loading={isLoading}
          socket={socket}
          connected={connected}
        profile={profile}
        currNote={currNote}
        setCurrNote={setCurrNote}
      />
      <MainPanel
        setSidebar={setSidebar}
        sidebar={sidebar}
        user={user}
        auth={isAuthenticated}
        loading={isLoading}
        socket={socket}
        profile={profile}
        currNote={currNote}
        setCurrNote={setCurrNote}
      />
    </AppComp>
  );
}

export default App;

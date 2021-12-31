import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useAuth0 } from "@auth0/auth0-react";
import "./styles/App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MainPanel from "./components/MainPanel";
import { SocketContext, Socket } from "./components/Socket";
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
  const [connected, setConnected] = useState<boolean>(false);
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [currNote, setCurrNote] = useState<Note | undefined>(undefined);

  // Refs of App (mutable vals)
  const profileRequestSent = useRef(false);
  const retrySocket = useRef(false);

  // Connect to socket using Socket react context
  const socket = React.useContext(SocketContext);
  
  // useEffect hook to connect socket once created
  useEffect(() => {
    // When socket is created, setup handlers
    if (socket) {
      // On connect handler
      socket.on("connect", () => {
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
        socket.emit(
          "profile_request",
          {
            email: user.email,
            name: user.name,
            picture: user.picture,
            user_id: user.sub,
          },
          (msg: Profile) => {
            // after receiving ack message from server
            console.log("Received profile response!");
            setProfile(msg);
          }
        );
      }
    }

    // Return no cleanup
    return () => {
      return;
    };
  }, [socket, isAuthenticated, user, sConnected]);

  // Create addNoteCallback function for children to use when adding a new note
  const addNoteCallback = useCallback(
    () => {
      console.log("Hit the add button!");
      if (socket && user && user.sub && !isLoading) {
        socket.emit(
          "add_note",
          { user_id: user.sub, name: "New Note", data: "" },
          (profile: Profile, note_id: number) => {
            // ack function
            // Load the returned profile and redirect to the returned note
            console.log(
              `Received profile refresh and note redirect request for note ${note_id}!`
            );
            setProfile(profile);
            if (profile && profile.notes) {
              let notes_with_id = profile.notes.filter((obj) => {
                return obj.note_id === note_id;
              });
              if (notes_with_id && notes_with_id.length > 0) {
                setCurrNote(notes_with_id[0]);
              }
            }
          }
        );
      }
      return;
    },
    [isLoading, socket, user],
  )
  
  // Setup deleteNoteCallback that can be used by child components
  const deleteNoteCallback = useCallback(
    (e, note_id) => {
      // Stop click propagation
      e.stopPropagation();

      // Check if socket is connected, if so, emit delete_note message
      if (socket && sConnected && user && user.sub) {
        console.log("Sending delete_note request!");
        socket.emit(
          "delete_note",
          {
            user_id: user.sub,
            note_id: note_id,
          },
          (new_profile: Profile) => {
            // Ack function, refresh profile
            setProfile(new_profile);

            // If note_id of deleted note is same as active note, unset active note
            if (profile && profile.notes) {
              let notes_with_id = profile.notes.filter((obj) => {
                return obj.note_id === note_id;
              });
              if (notes_with_id && notes_with_id.length > 0 && currNote === notes_with_id[0]) {
                setCurrNote(undefined);
              }
            }
          }
        );
      }
    },
    [socket, sConnected, user, currNote, profile]
  );

  // Return App component jsx
  return (
    <SocketContext.Provider value={Socket}>
      <AppComp>
        <Navbar
          setSidebar={setSidebar}
          sidebar={sidebar}
          user={user}
          auth={isAuthenticated}
          loading={isLoading}
          profile={profile}
          socket={socket}
          addNoteCallback={addNoteCallback}
        />
        <Sidebar
          setSidebar={setSidebar}
          sidebar={sidebar}
          user={user}
          auth={isAuthenticated}
          loading={isLoading}
          socket={socket}
          profile={profile}
          currNote={currNote}
          setCurrNote={setCurrNote}
          deleteNoteCallback={deleteNoteCallback}
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
    </SocketContext.Provider>
  );
}

export default App;

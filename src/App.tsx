import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { useAuth0 } from "@auth0/auth0-react";
import "./styles/App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MainPanel from "./components/MainPanel";
import { SocketContext, Socket } from "./components/Socket";
import { ProfileWithNotes, Note } from "./interfaces";

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
  const [profile, setProfile] = useState<ProfileWithNotes | undefined>(undefined);
  const [currNote, setCurrNote] = useState<Note | undefined>(undefined);
  const [retryState, setRetryState] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth0();

  // Refs of App (mutable vals)
  const sent: React.MutableRefObject<{ [key: string]: Boolean }> = useRef({});
  const recv: React.MutableRefObject<{ [key: string]: Boolean }> = useRef({});
  const retry: React.MutableRefObject<{ [key: string]: Boolean }> = useRef({});
  const [showSaveButton, setShowSaveButton] = useState(false);

  // Connect to socket using Socket react context
  const socket = React.useContext(SocketContext);

  // useEffect hook to handle connects and disconnects once socket created
  useEffect(() => {
    if (socket) {
      // On connect handler
      socket.on("connect", () => {
        console.log("Connected to backend!");
        if (!sent.current["profile_request"] ||
          retry.current["profile_request"] === true) {
          console.log("Profle request not sent, setting retry state!");
          setRetryState(true);
        }
      });
      // On disconnect handler
      socket.on("disconnect", () => {
        console.log("Lost connection with backend!");

        if (
          sent.current["profile_request"] === true &&
          !recv.current["profile_request"]
        ) {
          retry.current["profile_request"] = true;
        }
      });
    }
  }, [socket]);

  // useEffect hook to setup socket handlers once it is connected
  useEffect(() => {
    // When socket is created, setup handlers
    if (socket) {
      // ProfileWithNotes refresh handler
      socket.on("profile_refresh", (msg: ProfileWithNotes) => {
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
    console.log("In profile_request useEffect hook!");
    console.log("connected=" + socket.connected);
    console.log("user=" + user);
    console.log("isAuthenticated=" + isAuthenticated);
    console.log("profile_request sent=" + sent.current["profile_request"]);
    console.log("profile_request retry=" + retry.current["profile_request"]);
    setRetryState(false);
    if (socket) {
      // If connected and authenticated, request profile information
      if (
        socket.connected === true &&
        user &&
        isAuthenticated &&
        (!sent.current["profile_request"] ||
          retry.current["profile_request"] === true)
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
          (msg: ProfileWithNotes) => {
            // after receiving ack message from server
            console.log("Received profile response!");
            recv.current["profile_request"] = true;
            retry.current["profile_request"] = false;
            setProfile(msg);
            setSidebar(true);
          }
        );
        sent.current["profile_request"] = true;
        retry.current["profile_request"] = false;
        setTimeout(() => {
          if (!recv.current["profile_request"]) {
            retry.current["profile_request"] = true;
            setRetryState(true);
          }
        }, 3000);
      }
    }

    // Return no cleanup
    return () => {
      return;
    };
  }, [socket, isAuthenticated, user, retryState]);

  // Create addNoteCallback function for children to use when adding a new note
  const addNoteCallback = useCallback(() => {
    console.log("Hit the add button!");
    if (socket && user && user.sub && !isLoading) {
      socket.emit(
        "add_note",
        { user_id: user.sub, name: "New Note", data: "" },
        (profile: ProfileWithNotes, note_id: number) => {
          // ack function, load the returned profile and redirect to the returned note
          console.log(`Received profile refresh and note redirect request for note ${note_id}!`);
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
  }, [isLoading, socket, user]);

  // Setup deleteNoteCallback that can be used by child components
  const deleteNoteCallback = useCallback(
    (e, note_id) => {
      // Stop click propagation
      e.stopPropagation();

      // Check if socket is connected, if so, emit delete_note message
      if (socket && socket.connected && user && user.sub) {
        console.log("Sending delete_note request!");
        socket.emit(
          "delete_note",
          {
            user_id: user.sub,
            note_id: note_id,
          },
          (new_profile: ProfileWithNotes) => {
            // Ack function, refresh profile
            setProfile(new_profile);

            // If note_id of deleted note is same as active note, unset active note
            if (profile && profile.notes) {
              let notes_with_id = profile.notes.filter((obj) => {
                return obj.note_id === note_id;
              });
              if (
                notes_with_id &&
                notes_with_id.length > 0 &&
                currNote === notes_with_id[0]
              ) {
                setCurrNote(undefined);
              }
            }
          }
        );
      }
    },
    [socket, user, currNote, profile]
  );

  // Create addNoteCallback function for children to use when adding a new note
  const saveCurrNoteCallback = useCallback(() => {
    if (socket && user && user.sub && !isLoading && currNote) {
      socket.emit(
        "save_note",
        {
          user_id: user.sub,
          name: currNote.new_name,
          data: currNote.data,
          note_id: currNote.note_id,
        },
        () => {
          // ack function, save was successful, update currNote with its new data
          currNote.orig_data = currNote.data;
          currNote.name = currNote.new_name;
          setShowSaveButton(false);
        }
      );
    }
    return;
  }, [isLoading, socket, user, currNote]);

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
          saveCurrNoteCallback={saveCurrNoteCallback}
          showSaveButton={showSaveButton}
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
          showSaveButton={showSaveButton}
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
          showSaveButton={showSaveButton}
          setShowSaveButton={setShowSaveButton}
          saveCurrNoteCallback={saveCurrNoteCallback}
        />
      </AppComp>
    </SocketContext.Provider>
  );
}

export default App;

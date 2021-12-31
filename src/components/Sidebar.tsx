import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { User } from "@auth0/auth0-react";
import { FaTrash } from "react-icons/fa";
import { Profile, Note } from "../interfaces";
import { Socket } from "socket.io-client";

// Create styled components for the navbar (emotion.js)
const Side = styled.div`
  /* below nav header */
  background-color: var(--bg);
  height: calc(100vh - var(--nav-height));
  display: flex;
  justify-content: center;
  position: fixed;
  top: var(--nav-height);
  padding: var(--sidebar-padding);
  width: var(--sidebar-width);
  overflow: scroll;
  border-right: var(--border);
  border-top: var(--border);
  /* hide sidebar by default w/ transition */
  left: calc(-1 * var(--sidebar-width));
  transition-property: left;
  transition-duration: var(--sidebar-out-time);
  /* if active, show the sidebar w/ transition */
  &.side-active {
    left: 0;
    transition-duration: var(--sidebar-in-time);
  }
`;

const SideButton = styled.li`
  background-color: var(--bg);
  color: var(--bg-text);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 5px;
  width: var(--sidebar-width);
  text-align: center;
  display: flex;
  justify-content: center;
  align-content: center;
  &:hover {
    background-color: var(--bg-bold);
    color: var(--bg-text-bold);
    cursor: pointer;
  }
  &.active {
    background-color: var(--bg-bold);
    color: var(--bg-text-bold);
  }
  & .trash {
    visibility: hidden;
  }
  &:hover .trash {
    visibility: visible;
  }
  `;

  const SideDeleteButton = styled(FaTrash)`
    font-size: 1rem;
    padding: 0.1rem;
    margin-right: 0.25rem;
    justify-self: right;
    cursor: pointer;
    flex: 0 1 auto;
    position: absolute;
    right: 0.5rem;
    color: var(--bg-text-light);
    &:hover {
      color: var(--bg-text-bold);
    }
  `;

const SideButtonList = styled.ul``;

// Exported Sidebar react component
function Sidebar(props: {
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  sidebar: boolean;
  user: User | undefined;
  auth: boolean;
  loading: boolean;
  socket: Socket | undefined;
  connected: boolean;
  profile: Profile | undefined;
  currNote: Note | undefined;
  setCurrNote: React.Dispatch<React.SetStateAction<Note | undefined>>;
}) {
  // useState hook to track the list of notes JSX elements
  const [notesList, setNotesList] = useState<JSX.Element[]>([]);
  const { profile, currNote, setCurrNote } = props;

  // Delete note button callback
  const user_id = props.user && props.user.sub ? props.user.sub : undefined;
  const deleteNoteCallback = useCallback((e, note_id) => {
    // Stop click propagation
    e.stopPropagation();

    // Check if socket is connected, if so, emit delete_note message
    if (props.socket && props.connected && user_id) {
      console.log('Sending delete_note request!');
      props.socket.emit("delete_note", {
        user_id: user_id,
        note_id: note_id,
      });
    }
  }, [props.socket, props.connected, user_id]);

  // Compile list of notes, updating when profile changes
  useEffect(() => {
    if (profile && profile.notes) {
      let tempNotesList: JSX.Element[] = [];
      profile.notes.forEach(
        (note: { note_id: number; name: string; data: string }) => {
          tempNotesList = tempNotesList.concat(
            <SideButton
              className={
                currNote && note.note_id === currNote.note_id ? "active" : ""
              }
              key={note.note_id}
              onClick={() => {
                setCurrNote(note);
              }}
            >
              <p>{note.name}</p>
              <SideDeleteButton
                key={note.note_id}
                className="trash"
                onClick={(e) => deleteNoteCallback(e, note.note_id)}
              />
            </SideButton>
          );
        }
      );
      setNotesList(tempNotesList);
    }
  }, [profile, setCurrNote, currNote, deleteNoteCallback]);

  // Return jsx for component
  return (
    <>
      <Side className={props.sidebar ? "side-active" : ""}>
        <SideButtonList>{notesList}</SideButtonList>
      </Side>
    </>
  );
}

export default Sidebar;

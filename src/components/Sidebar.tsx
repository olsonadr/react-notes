import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { User } from "@auth0/auth0-react";
import { FaTrash } from "react-icons/fa";
import { ProfileWithNotes, Note } from "../interfaces";
import { Socket } from "socket.io-client";

// Create styled components for the navbar (emotion.js)
const Side = styled.div`
  /* below nav header */
  background-color: var(--bg);
  height: calc(100vh - var(--nav-height));
  display: flex;
  /* justify-content: center; */
  position: fixed;
  top: var(--nav-height);
  padding: var(--sidebar-padding);
  width: var(--sidebar-width);
  overflow-y: scroll;
  overflow-x: hidden;
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
  width: calc(
    var(--sidebar-width) - 1 * var(--sidebar-trash-padding) - 2 * var(--sidebar-padding)
  );
  word-break: break-all;
  display: flex;
  position: relative;
  justify-content: left;
  align-content: center;
  text-align: left;
  &:hover {
    background-color: var(--bg-bold);
    color: var(--bg-text-bold);
    cursor: pointer;
  }
  &.active,
  &#active {
    background-color: var(--bg-bold);
    color: var(--bg-text-bold);
  }
  &::before {
    content: "";
    width: 0.5rem;
    height: 0.5rem;
    background-color: var(--bg-bolder);
    visibility: hidden;
    filter: brightness(200%);
    border-radius: 50%;
    align-self: center;
    margin-left: var(--sidebar-altered-margin);
    margin-right: var(--sidebar-altered-margin);
    flex-shrink: 0;
  }
  &.altered::before {
    visibility: visible;
  }
  & .trash {
    visibility: hidden;
  }
  &:hover .trash,
  &.active .trash {
    visibility: visible;
  }
  & p {
    align-self: center;
  }
`;

const SideDeleteButton = styled(FaTrash)`
  font-size: var(--sidebar-trash-width);
  padding: var(--sidebar-trash-padding);
  margin-right: var(--sidebar-trash-rmargin);
  align-self: center;
  margin-left: auto;
  cursor: pointer;
  flex: 0 0 auto;
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
  profile: ProfileWithNotes | undefined;
  currNote: Note | undefined;
  setCurrNote: React.Dispatch<React.SetStateAction<Note | undefined>>;
  deleteNoteCallback: (e: any, note_id: any) => void;
  showSaveButton: boolean;
}) {
  // Destructure props that will be used in dependency lists
  const { profile, currNote, setCurrNote, deleteNoteCallback, showSaveButton } =
    props;

  // useState hook to track the list of notes JSX elements
  const [notesList, setNotesList] = useState<JSX.Element[]>([]);

  // Establish callback to pass to currNote to auto scroll to it
  const currNoteScrollCallbackRef = useCallback((domNode) => {
    if (domNode) {
      domNode.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Compile list of notes, updating when profile changes
  useEffect(() => {
    if (profile && profile.notes) {
      let tempNotesList: JSX.Element[] = [];
      profile.notes.forEach(
        (note: {
          note_id: number;
          name: string;
          new_name: string;
          data: string;
          orig_data: string;
        }) => {
          // Establish classList
          let classList = "";
          // If active note, add "active" class
          classList = classList.concat(
            currNote && note.note_id === currNote.note_id ? "active" : ""
          );
          // If active note, add "active" class
          classList = classList.concat(
            note.data !== note.orig_data || note.name !== note.new_name ? " altered" : ""
          );
          // Add the button to the temp list
          tempNotesList = tempNotesList.concat(
            <SideButton
              // id={currNote && note.note_id === currNote.note_id ? "active" : ""}
              className={classList}
              key={note.note_id}
              ref={
                currNote && note.note_id === currNote.note_id
                  ? currNoteScrollCallbackRef
                  : null
              }
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
  }, [
    profile,
    setCurrNote,
    currNote,
    deleteNoteCallback,
    currNoteScrollCallbackRef,
    showSaveButton,
  ]);

  // Return jsx for component
  return (
    <>
      <Side
        id="sidebar-button-list"
        className={props.sidebar ? "side-active" : ""}
      >
        <SideButtonList>{notesList}</SideButtonList>
      </Side>
    </>
  );
}

export default Sidebar;

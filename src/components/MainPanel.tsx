import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import {
  Editor,
  EditorState,
  CompositeDecorator,
  ContentBlock,
  ContentState,
  RichUtils,
} from "draft-js";
import { Box, Paper } from "@material-ui/core";
import { linkStrategy } from "./linkStrategy";
import { DecoratedLink } from "./DecoratedLink";
import { MediaComponent } from "./MediaComponent";
import LoginButton from "./LoginButton";
import { User } from "@auth0/auth0-react";
import { Note, ProfileWithNotes } from "../interfaces";
import "draft-js/dist/Draft.css";
import { EditorContext } from "./EditorContext";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// Create styled components for the navbar (emotion.js)
const Main = styled.div`
  /* below nav header */
  background-color: var(--fg);
  height: calc(100vh - var(--nav-height));
  display: flex;
  justify-content: center;
  position: fixed;
  top: var(--nav-height);
  padding: 5px;
  overflow: scroll;
  /* take full width with hidden sidebar */
  left: 0;
  right: 0;
  transition-property: left;
  transition-duration: var(--sidebar-out-time);
  /* if sidebar active, offset left to fit */
  &.side-active {
    left: calc(var(--sidebar-width) + 2 * var(--sidebar-padding));
    transition-duration: var(--sidebar-in-time);
  }
`;

const H1 = styled.h1`
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: bold;
  color: var(--fg-text);
`;

const H2 = styled.h2`
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  color: var(--fg-text-bold);
`;

const VertFlex = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

// Exported MainPanel react component
function MainPanel(props: {
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  sidebar: boolean;
  user: User | undefined;
  auth: boolean;
  loading: boolean;
  socket: any;
  profile: ProfileWithNotes | undefined;
  currNote: Note | undefined;
  setCurrNote: React.Dispatch<React.SetStateAction<Note | undefined>>;
  showSaveButton: boolean;
  setShowSaveButton: React.Dispatch<React.SetStateAction<boolean>>;
  saveCurrNoteCallback: () => void;
}) {
  // Will be state of the current note when user notes implemented
  const noteSelected: boolean = props.currNote ? true : false;
  const noteLoaded: boolean = props.currNote ? true : false;
  //   const noteLoaded:boolean = props.currNote ? props.currNote.loaded : false;

  // Return jsx output for this component
  return (
    <>
      <Main className={props.sidebar ? "side-active" : ""}>
        {/* If logged in and profile and note loaded (main!) */}
        {props.profile &&
          noteSelected &&
          noteLoaded &&
          props.auth &&
          props.user &&
          !props.loading && (
            <TextEditor
              currNote={props.currNote}
              setCurrNote={props.setCurrNote}
              showSaveButton={props.showSaveButton}
              setShowSaveButton={props.setShowSaveButton}
              saveCurrNoteCallback={props.saveCurrNoteCallback}
            />
          )}
        {/* If logged in and profile loaded, but selected note not loaded */}
        {props.profile &&
          noteSelected &&
          !noteLoaded &&
          props.auth &&
          props.user &&
          !props.loading && (
            <VertFlex>
              <H1>Hello, {props.user.name}!</H1>
              <H2>Please open or create a note!</H2>
            </VertFlex>
          )}
        {/* If logged in and profile loaded, but no note selected */}
        {props.profile &&
          !noteSelected &&
          props.auth &&
          props.user &&
          !props.loading && (
            <VertFlex>
              <H1>Hello, {props.user.name}!</H1>
              <H2>Please select a note!</H2>
            </VertFlex>
          )}
        {/* If logged in but loading profile still */}
        {!props.profile && props.auth && props.user && !props.loading && (
          <VertFlex>
            <H1>Hello, {props.user.name}!</H1>
            <H2>Loading your profile...</H2>
          </VertFlex>
        )}
        {/* If logged out: */}
        {!props.auth && !props.loading && (
          <VertFlex>
            <H1>Welcome to React Notes!</H1>
            <H2>Please login!</H2>
            <LoginButton className="new-line margin-top" />
          </VertFlex>
        )}
        {/* If loading authentication stuff */}
        {props.loading && (
          <VertFlex>
            <H1>Authenticating Session...</H1>
          </VertFlex>
        )}
      </Main>
    </>
  );
}

// Styled Box component that holds all text-editor styles
const BoxS = styled(Box)`
  /* Container styles */
  width: 100%;

  /* Title headers */
  & h1 {
    font-weight: bold;
    font-size: 14pt;
    margin-bottom: 1rem;
  }

  & .name_box * {
    font-weight: bold;
    font-size: 14pt;
  }

  & .name_box {
    border-bottom: var(--border);
    border-style: dashed;
    border-color: gray;
  }
`;

// Local TextEditor react component
// Inspiration: https://medium.com/swlh/rich-editor-for-your-react-typescript-project-using-hooks-21c669e54df2
function TextEditor(props: {
  currNote: Note | undefined;
  setCurrNote: React.Dispatch<React.SetStateAction<Note | undefined>>;
  showSaveButton: boolean;
  setShowSaveButton: React.Dispatch<React.SetStateAction<boolean>>;
  saveCurrNoteCallback: () => void;
}) {
  // Dereference props for dependency lists
  const {
    currNote,
    setCurrNote,
    showSaveButton,
    setShowSaveButton,
    saveCurrNoteCallback,
  } = props;

  // Get ref to editor
  const editor = useRef<Editor>(null);
  const nameEditor = useRef<Editor>(null);
  const focus = useRef<boolean>(false);
  const [focusCheck, setFocusCheck] = useState<boolean>(false);

  // Callback for setting editor state on note load
  const loadCurrNote = useCallback(() => {
    const newEditorState = EditorState.createWithContent(
      ContentState.createFromText(
        currNote && currNote.data ? currNote.data : ""
      ),
      // EditorState.createEmpty(
      new CompositeDecorator([
        { strategy: linkStrategy, component: DecoratedLink },
      ])
    );
    // Return state for this note
    return newEditorState;
  }, [currNote]);

  // Callback for setting nameEditor state on note load
  const loadCurrNoteName = useCallback(() => {
    const newNameEditorState = EditorState.createWithContent(
      ContentState.createFromText(
        currNote && currNote.new_name ? currNote.new_name : ""
      ),
      // EditorState.createEmpty(
      new CompositeDecorator([
        { strategy: linkStrategy, component: DecoratedLink },
      ])
    );
    // Return state for this note
    return newNameEditorState;
  }, [currNote]);

  // State of editor
  const [editorState, setEditorState] = useState<EditorState>(loadCurrNote);
  const [nameEditorState, setNameEditorState] =
    useState<EditorState>(loadCurrNoteName);

  // Focus editor callback
  const focusEditor = React.useCallback(() => {
    if (editor.current) {
      editor.current.focus();
    }
  }, [editor]);
  const focusNameEditor = React.useCallback(() => {
    if (nameEditor.current) {
      nameEditor.current.focus();
    }
  }, [nameEditor]);


  // When note changes, change editor state
  useEffect(() => {
    // Get currNote's data into text editor
    setEditorState(loadCurrNote());
    focus.current = true;
    setFocusCheck(true);
  }, [currNote, loadCurrNote, setShowSaveButton, focusEditor]);

  // When note name changes, change name editor state
  useEffect(() => {
    // Get currNote's name into text editor
    setNameEditorState(loadCurrNoteName());
  }, [currNote, loadCurrNoteName, setShowSaveButton]);


  // When content changes, check if the save button should be displayed
  useEffect(() => {
    // Set whether the save button should be visible for this note
    setShowSaveButton(
      currNote !== undefined && (currNote.data !== currNote.orig_data || currNote.new_name !== currNote.name)
    );
  }, [currNote, setShowSaveButton, editorState, nameEditorState]);


  // Focus if requested before render
  useEffect(() => {
    if (focusCheck) {
      setFocusCheck(false);
      focusEditor();
    }
  }, [focusCheck, setFocusCheck, focusEditor]);

  // Custom onChange callback to save content in currNote
  const onEditorChangeCallback = useCallback(
    (editorState: EditorState) => {
      // Establish editor state to update
      let newEditorState = editorState;

      // Set editor state useState hook
      setEditorState(newEditorState);

      // Get whether the save button should be displayed
      if (currNote) {
        const currentContent = newEditorState.getCurrentContent();
        const currData = currentContent.getPlainText();
        // const currName = currentContent.getBlockMap().first().getText();

        currNote.data = currData;
        setCurrNote(currNote);

        if (!showSaveButton) {
          setShowSaveButton(currNote.orig_data !== currNote.data);
        }        
      }

      // Return finalized newEditorState
      return newEditorState;
    },
    // [currNote, showSaveButton, setShowSaveButton]
    [currNote, setCurrNote, showSaveButton, setShowSaveButton]
  );

  // Custom onChange callback to save name in currNote
  const onNameEditorChangeCallback = useCallback(
    (editorState: EditorState) => {
      // Establish editor state to update
      let newEditorState = editorState;

      // Set editor state useState hook
      setNameEditorState(newEditorState);

      // Get whether the save button should be displayed
      if (currNote) {
        const currentContent = newEditorState.getCurrentContent();
        // const currData = currentContent.getPlainText();
        const currName = currentContent.getBlockMap().first().getText();
        // const currName = convertToRaw(currentContent.getBlockMap()).blocks.find();
        // const currRaw = convertToRaw(editorState.getCurrentContent());

        // currNote.data = currData;
        currNote.new_name = currName;
        setCurrNote(currNote);
        
        if (!showSaveButton) {
          setShowSaveButton(currNote.name !== currNote.new_name);
        }
      }

      // Return finalized newEditorState
      return newEditorState;
    },
    // [currNote, showSaveButton, setShowSaveButton]
    [currNote, setCurrNote, showSaveButton, setShowSaveButton]
  );

  // Handle keyboard shortcuts
  // Source: https://holycoders.com/snippets/react-js-detect-save-copy-keyboard-shortcuts/
  const handleKeyDown = useCallback(
    (event) => {
      // Get the key event
      let charCode = String.fromCharCode(event.which).toLowerCase();
      // Prevent default and save if needed and if key event was ctrl/meta + s
      if ((event.ctrlKey || event.metaKey) && charCode === "s") {
        event.preventDefault();
        if (showSaveButton) saveCurrNoteCallback();
      }
    },
    [saveCurrNoteCallback, showSaveButton]
  );

  // Handle draft-js key commands
  // Source: https://draftjs.org/docs/quickstart-rich-styling
  const handleKeyCommand = useCallback(
    (command, editorState) => {
      // Let RichUtils handle the other possible commands
      const newState = RichUtils.handleKeyCommand(editorState, command);

      // Assign new state as needed
      if (newState) {
        onEditorChangeCallback(newState);
        return "handled";
      }

      return "not-handled";
    },
    [onEditorChangeCallback]
  );

  // Render block callback
  const renderBlock = (contentBlock: ContentBlock) => {
    if (contentBlock.getType() === "atomic") {
      const entityKey = contentBlock.getEntityAt(0);
      const entityData = editorState
        .getCurrentContent()
        .getEntity(entityKey)
        .getData();
      return {
        component: MediaComponent,
        editable: false,
        props: {
          src: { file: entityData.src },
        },
      };
    }
  };

  // Return jsx output for this component
  return (
    <BoxS onKeyDown={handleKeyDown}>
      <Box m={2}>
        <Box>
          <Paper>
            {/* <Paper style={{ minHeight: "100px" }}> */}
            <Box className="name_box" onClick={focusNameEditor} p={4}>
              <EditorContext.Provider value={nameEditorState}>
                <Editor
                  editorState={nameEditorState}
                  onChange={onNameEditorChangeCallback}
                  placeholder="Click here to start typing..."
                  blockRendererFn={renderBlock}
                  handleKeyCommand={handleKeyCommand}
                  ref={nameEditor}
                />
              </EditorContext.Provider>
            </Box>
            <Box onClick={focusEditor} p={4}>
              <EditorContext.Provider value={editorState}>
                <Editor
                  editorState={editorState}
                  onChange={onEditorChangeCallback}
                  placeholder="Click here to start typing..."
                  blockRendererFn={renderBlock}
                  handleKeyCommand={handleKeyCommand}
                  ref={editor}
                />
              </EditorContext.Provider>
            </Box>
          </Paper>
        </Box>
      </Box>
    </BoxS>
  );
}

export default MainPanel;

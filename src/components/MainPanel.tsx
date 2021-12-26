import React, { useRef, useState } from "react";
import styled from "@emotion/styled";
import {
  Editor,
  EditorState,
  CompositeDecorator,
  ContentBlock,
  ContentState
} from "draft-js";
import {
  Box,
  Paper,
} from "@material-ui/core";
import { linkStrategy } from "./linkStrategy";
import { DecoratedLink } from "./DecoratedLink";
import { MediaComponent } from "./MediaComponent";
import LoginButton from "./LoginButton";
import { User } from "@auth0/auth0-react";
import { Profile } from "../interfaces";
import 'draft-js/dist/Draft.css';
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
  profile: Profile | undefined;
  note?: {loaded: boolean, data: string};
}) {
  // Will be state of the current note when user notes implemented
  const noteSelected:boolean = props.note ? true : false;
  const noteLoaded:boolean = props.note ? props.note.loaded : false;

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
            <TextEditor note={props.note}/>
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
            <H1>Welcome to react_notes!</H1>
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

// Styled Box component
const BoxS = styled(Box)`
  width: 100%;
`;

// Local TextEditor react component
// Inspiration: https://medium.com/swlh/rich-editor-for-your-react-typescript-project-using-hooks-21c669e54df2
function TextEditor(props: {
  note?: { loaded: boolean; data: string };
  setNoteData?: (newData:string)=>{} | undefined;
}) {
  // Get ref to editor
  const editor = useRef<Editor>(null);

  // State of editor
  const [editorState, setEditorState] = useState<EditorState>(
    EditorState.createWithContent(
      ContentState.createFromText(
        props.note && props.note.data ? props.note.data : ""
      ),
    // EditorState.createEmpty(
      new CompositeDecorator([{strategy: linkStrategy, component: DecoratedLink}])
    )
  );

  // Focus editor callback
  const focusEditor = React.useCallback(() => {
    if (editor.current) {
      editor.current.focus();
    }
  }, [editor]);

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
    <BoxS>
      <Box m={2}>
        <Box>
          <Paper style={{ minHeight: "144px" }}>
            <Box onClick={focusEditor} p={4}>
              <EditorContext.Provider value={editorState}>
                <Editor
                  editorState={editorState}
                  onChange={setEditorState}
                  placeholder="Click here to start typing in the editor..."
                  blockRendererFn={renderBlock}
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

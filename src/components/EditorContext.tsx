// Source: https://github.com/gustav1105/draft-js-editor/blob/master/src/EditorContext.tsx
import * as React from "react";
import { EditorState } from "draft-js";

export const EditorContext = React.createContext<EditorState>(
  EditorState.createEmpty()
);
import ReactDOM from "react-dom";
import Sidebar from "../../components/Sidebar";
import testPropCombinations from "../utils/testPropCombinations";

test("Sidebar renders without exception", () => {
  // Setup options for each property
  const setSidebarOpt = [() => {}];
  const sidebarOpt = [true, false];
  const userOpt = [undefined];
  const authOpt = [true, false];
  const loadingOpt = [true, false];
  const profileOpt = [undefined];
  const setCurrNoteOpt = [() => {}];
  const currNoteOpt = [
    undefined,
    { note_id: 2, name: "new note", data: "contents!" },
  ];
  const propCombs = {
    setSidebar: setSidebarOpt,
    sidebar: sidebarOpt,
    user: userOpt,
    auth: authOpt,
    loading: loadingOpt,
    profile: profileOpt,
    currNote: currNoteOpt,
    setCurrNote: setCurrNoteOpt,
  };

  // Setup callback to test each combinatio
  const callback = (props: { [key: string]: any }) => {
    const div = document.createElement("div");
    ReactDOM.render(
      <Sidebar
        setSidebar={props.setSidebar}
        sidebar={props.sidebar}
        user={props.user}
        auth={props.auth}
        loading={props.loading}
        profile={props.profile}
        setCurrNote={props.setCurrNoteOpt}
        currNote={props.currNoteOpt}
      />,
      div
    );
  };

  // Use testPropCombinations to test each combination
  testPropCombinations(propCombs, callback);
});

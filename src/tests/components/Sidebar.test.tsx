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
  const socketOpt = [undefined];
  const connectedOpt = [false];
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
    socket: socketOpt,
    connected: connectedOpt,
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
        socket={props.socket}
        connected={props.connected}
      />,
      div
    );
  };

  // Use testPropCombinations to test each combination
  testPropCombinations(propCombs, callback);
});

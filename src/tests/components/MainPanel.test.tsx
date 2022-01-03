import ReactDOM from "react-dom";
import MainPanel from "../../components/MainPanel";
import testPropCombinations from "../utils/testPropCombinations";

test("MainPanel renders without exception", () => {
  // Setup options for each property
  const setSidebarOpt = [() => {}];
  const sidebarOpt = [true, false];
  const userOpt = [undefined];
  const authOpt = [true, false];
  const loadingOpt = [true, false];
  const socketOpt = [undefined];
  const profileOpt = [undefined];
  const setCurrNoteOpt = [() => {}];
  const showSaveButtonOpt = [true, false];
  const setShowSaveButtonOpt = [()=>{}];
  const saveCurrNoteCallbackOpt = [()=>{}];
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
    socket: socketOpt,
    profile: profileOpt,
    currNote: currNoteOpt,
    setCurrNote: setCurrNoteOpt,
    showSaveButton: showSaveButtonOpt,
    setShowSaveButton: setShowSaveButtonOpt,
    saveCurrNoteCallback: saveCurrNoteCallbackOpt,
  };

  // Setup callback to test each combinatio
  const callback = (props: { [key: string]: any }) => {
    const div = document.createElement("div");
    ReactDOM.render(
      <MainPanel
        setSidebar={props.setSidebar}
        sidebar={props.sidebar}
        user={props.user}
        auth={props.auth}
        loading={props.loading}
        socket={props.socket}
        profile={props.profile}
        setCurrNote={props.setCurrNote}
        currNote={props.currNote}
        showSaveButton={props.showSaveButton}
        setShowSaveButton={props.setShowSaveButton}
        saveCurrNoteCallback={props.saveCurrNoteCallback}
      />,
      div
    );
  };

  // Use testPropCombinations to test each combination
  testPropCombinations(propCombs, callback);
});

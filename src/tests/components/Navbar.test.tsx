import ReactDOM from "react-dom";
import Navbar from "../../components/Navbar";
import testPropCombinations from "../utils/testPropCombinations";

test("Navbar renders without exception", () => {
  // Setup options for each property
  const setSidebarOpt = [() => {}];
  const sidebarOpt = [true, false];
  const userOpt = [undefined];
  const authOpt = [true, false];
  const loadingOpt = [true, false];
  const profileOpt = [undefined];
  const socketOpt = [undefined];
  const addNoteOpt = [()=>{return;}];
  const saveCurrNoteCallbackOpt = [()=>{return;}];
  const showSaveButtonOpt = [false, true];
  const propCombs = {
    setSidebar: setSidebarOpt,
    sidebar: sidebarOpt,
    user: userOpt,
    auth: authOpt,
    loading: loadingOpt,
    profile: profileOpt,
    socket: socketOpt,
    addNoteCallback: addNoteOpt,
    saveCurrNoteCallback: saveCurrNoteCallbackOpt,
    showSaveButton: showSaveButtonOpt,
  };

  // Setup callback to test each combinatio
  const callback = (props: { [key: string]: any }) => {
    const div = document.createElement("div");
    ReactDOM.render(
      <Navbar
        setSidebar={props.setSidebar}
        sidebar={props.sidebar}
        user={props.user}
        auth={props.auth}
        loading={props.loading}
        profile={props.profile}
        socket={props.socket}
        addNoteCallback={props.addNoteCallback}
        saveCurrNoteCallback={props.saveCurrNoteCallback}
        showSaveButton={props.showSaveButton}
      />,
      div
    );
  };

  // Use testPropCombinations to test each combination
  testPropCombinations(propCombs, callback);
});

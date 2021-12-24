import ReactDOM from "react-dom";
import MainPanel from "../../components/MainPanel";

test("MainPanel renders without exception", () => {
  // Setup options for each property
  const setSidebarOpt = [() => {}];
  const sidebarOpt = [true, false];
  const userOpt = [undefined];
  const authOpt = [true, false];
  const loadingOpt = [true, false];

  // Renders without error for all combinations of params
  setSidebarOpt.forEach((setSidebar) => {
    sidebarOpt.forEach((sidebar) => {
      userOpt.forEach((user) => {
        authOpt.forEach((auth) => {
          loadingOpt.forEach((loading) => {
            const div = document.createElement("div");
            ReactDOM.render(
              <MainPanel
                setSidebar={setSidebar}
                sidebar={sidebar}
                user={user}
                auth={auth}
                loading={loading}
              />,
              div
            );
          });
        });
      });
    });
  });
});

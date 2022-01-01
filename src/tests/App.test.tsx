import ReactDOM from "react-dom";
import App from "../App";

// Mock socket creation
jest.mock("socket.io-client", () => {
  return (url: string, opts:{[key: string]:any} ) => {return undefined;};
});

test("App renders without exception", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <App />,
    div
  );
});

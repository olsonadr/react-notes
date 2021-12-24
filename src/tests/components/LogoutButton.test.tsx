import ReactDOM from "react-dom";
import LogoutButton from "../../components/LogoutButton";

test("LogoutButton renders without exception", () => {
  const div = document.createElement("div");
  ReactDOM.render(<LogoutButton />, div);
});

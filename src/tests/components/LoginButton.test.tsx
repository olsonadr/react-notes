import ReactDOM from "react-dom";
import LoginButton from "../../components/LoginButton";

test("LoginButton renders without exception", () => {
  const div = document.createElement('div');
  ReactDOM.render(<LoginButton />, div);
});

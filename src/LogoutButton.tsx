import React from "react";
import styled from "@emotion/styled";
import { useAuth0 } from "@auth0/auth0-react";

// Create styled components for the navbar (emotion.js)
const Butt = styled.button`
  background-color: var(--bg-bold);
  color: var(--bg-text);
  width: 100px;
  height: 60px;
  border: none;
  border-radius: 5px;
  /* Add newline if requested */
  &.new-line {
    white-space: pre-line;
  }
`;

// Exported LogoutButton react component
function LogoutButton(props: { className: string } = {className: ""}) {
  // Create Auth0 logout callback
  const { logout } = useAuth0();

  // Return jsx for this component
  return (
    <>
      <Butt
        className={props.className}
        onClick={() => {
          logout({ returnTo: window.location.origin });
        }}
      >
        Logout
      </Butt>
    </>
  );
}

export default LogoutButton;

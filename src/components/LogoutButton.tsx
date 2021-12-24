import React, { PropsWithChildren } from "react";
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

// Setup props of LoginButton (enabling default vals)
// Source: https://dev.to/bytebodger/default-props-in-react-typescript-2o5o
export type AllPropsRequired<Object> = {
  [Property in keyof Object]-?: Object[Property];
};
interface Props extends PropsWithChildren<any> {
  className?: string,
};

// Exported LogoutButton react component
function LogoutButton(props: Props) {
  // Set default props values
  const args: AllPropsRequired<Props> = {
    ...props,
    className: props.className !== undefined ? props.className : "",
  };
  
  // Create Auth0 logout callback
  const { logout } = useAuth0();

  // Return jsx for this component
  return (
    <>
      <Butt
        className={args.className}
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

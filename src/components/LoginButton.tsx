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
  /* Hover background if requested */
  &.hover-on:hover {
    background-color: var(--bg-bolder);
    color: var(--bg-text-bold);
  }
  /* Transition background color if requested */
  &.transition-bg {
    transition: background-color var(--speed) ease-in,
      color var(--speed) ease-in;
  }
  /* Use dropdown dimensions if requested */
  &.nav-dd-style {
    height: var(--nav-dd-button-height);
    height: var(--nav-button-size);
    padding: var(--nav-dd-button-padding);
    margin-top: 0.5rem;
    width: 100%;
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

// Exported LoginButton react component
function LoginButton(props: Props) {
  // Set default props values
  const args: AllPropsRequired<Props> = {
    ...props,
    className: props.className !== undefined ? props.className : "",
  };

  // Create Auth0 login callback
  const { loginWithRedirect } = useAuth0();

  // Return jsx for this component
  return (
    <>
      <Butt className={args.className} onClick={loginWithRedirect}>
        Login
      </Butt>
    </>
  );
}

export default LoginButton;

import React from "react";
import styled from "@emotion/styled";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { User } from "@auth0/auth0-react";
import { Profile } from "../interfaces";

// Create styled components for the navbar (emotion.js)
const Main = styled.div`
  /* below nav header */
  background-color: var(--fg);
  height: calc(100vh - var(--nav-height));
  display: flex;
  justify-content: center;
  position: fixed;
  top: var(--nav-height);
  padding: 5px;
  overflow: scroll;
  /* take full width with hidden sidebar */
  left: 0;
  right: 0;
  transition-property: left;
  transition-duration: var(--sidebar-out-time);
  /* if sidebar active, offset left to fit */
  &.side-active {
    left: calc(var(--sidebar-width) + 2 * var(--sidebar-padding));
    transition-duration: var(--sidebar-in-time);
  }
`;

const H1 = styled.h1`
  /* margin-top: 2rem; */
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: bold;
`;

const VertFlex = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

// Exported MainPanel react component
function MainPanel(props: {
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  sidebar: boolean;
  user: User | undefined;
  auth: boolean;
  loading: boolean;
  socket: any;
  profile: Profile | undefined;
}) {
  // Return jsx output for this component
  return (
    <>
      <Main className={props.sidebar ? "side-active" : ""}>
        {/* If logged in: */}
        {props.auth && props.user && !props.loading && (
          <VertFlex>
            <H1>
              Hello, {props.user.name}!
            </H1>
            <LogoutButton className="new-line" />
          </VertFlex>
        )}
        {/* If logged out: */}
        {!props.auth && !props.loading && (
          <VertFlex>
            <H1>Welcome to react_notes! Please login or signup!</H1>
            <LoginButton className="new-line" />
          </VertFlex>
        )}
        {/* If loading authentication stuff */}
        {props.loading && (
          <VertFlex>
            <H1>Loading...</H1>
          </VertFlex>
        )}
      </Main>
    </>
  );
}

export default MainPanel;

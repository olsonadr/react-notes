import React from "react";
import styled from "@emotion/styled";
import { User } from "@auth0/auth0-react";
import { Profile } from "../interfaces";

// Create styled components for the navbar (emotion.js)
const Side = styled.div`
  /* below nav header */
  background-color: var(--bg);
  height: calc(100vh - var(--nav-height));
  display: flex;
  justify-content: center;
  position: fixed;
  top: var(--nav-height);
  padding: var(--sidebar-padding);
  width: var(--sidebar-width);
  overflow: scroll;
  /* hide sidebar by default w/ transition */
  left: calc(-1*var(--sidebar-width));
  transition-property: left;
  transition-duration: var(--sidebar-out-time);
  /* if active, show the sidebar w/ transition */
  &.side-active {
    left: 0;
    transition-duration: var(--sidebar-in-time);
  }
`;

const SideButton = styled.li`
  background-color: var(--bg);
  color: var(--bg-text);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 5px;
  width: var(--sidebar-width);
  text-align: center;
  &:hover {
    background-color: var(--bg-bold);
    color: var(--bg-text-bold);
    cursor: pointer;
  }
`;

const SideButtonList = styled.ul`
`;

// Exported Sidebar react component
function Sidebar(props: {
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  sidebar: boolean;
  user: User | undefined;
  auth: boolean;
  loading: boolean;
  profile: Profile | undefined;
}) {
  // Return jsx for component
  return (
    <>
      <Side className={props.sidebar ? "side-active" : ""}>
        <SideButtonList>
          <SideButton>Item 1</SideButton>
          <SideButton>Item 2</SideButton>
          <SideButton>Item 3</SideButton>
          <SideButton>Item 4</SideButton>
          <SideButton>Item 5</SideButton>
        </SideButtonList>
      </Side>
    </>
  );
}

export default Sidebar;

import React from "react";
import styled from "@emotion/styled";
// import { AiOutlineClose } from "react-icons/ai";
// import "./styles/root.css"

// Create styled components for the navbar (emotion.js)
const Side = styled.div`
  /* below nav header */
  background-color: var(--bg);
  height: calc(100vh - var(--nav-height));
  display: flex;
  justify-content: center;
  position: fixed;
  top: var(--nav-height);
  padding: 5px;
  /* hide sidebar by default w/ transition */
  width: 0;
  transition: var(--sidebar-out-time);
  /* if active, show the sidebar w/ transition */
  &.side-active {
    width: var(--sidebar-width);
    transition: var(--sidebar-in-time);
  }
`;

const SideButton = styled.li`
  background-color: var(--bg);
  color: var(--bg-text);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 5px;
  width: var(--sidebar-width);
  &:hover {
    background-color: var(--bg-bold);
    color: var(--bg-text-bold);
    cursor: pointer;
  }
`;

// Exported Sidebar react component
function Sidebar(props: {
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  sidebar: boolean;
}) {
  // // Create wrapper to close sidebar using setState passed in props
  // function closeSidebar() { props.setSidebar(false); }

  // Return jsx for component
  return (
    <>
      <Side className={props.sidebar ? "side-active" : ""}>
        {/* <AiOutlineClose onClick={closeSidebar} />
        <h1>Sidebar</h1> */}
        <ul className="side-list">
          <SideButton>Item 1</SideButton>
          <SideButton>Item 2</SideButton>
          <SideButton>Item 3</SideButton>
          <SideButton>Item 4</SideButton>
          <SideButton>Item 5</SideButton>
        </ul>
      </Side>
    </>
  );
}

export default Sidebar;

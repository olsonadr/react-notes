import React from "react";
import styled from "@emotion/styled";

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
  /* take full width with hidden sidebar */
  left: 0;
  right: 0;
  transition: var(--sidebar-out-time);
  /* if sidebar active, offset left to fit */
  &.side-active {
    left: calc(var(--sidebar-width) + 2*var(--sidebar-padding));
    transition: var(--sidebar-in-time);
  }
`;

const H1 = styled.h1`
  margin-top: 2rem;
  font-size: 4rem;
  font-weight: bold; 
`;

function MainPanel(props: {
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  sidebar: boolean;
}) {
  // Return jsx output for this component
  return (
    <>
      <Main className={props.sidebar ? "side-active" : ""}>
        {/* <div className="MainPanel"> */}
        <H1>Hello!</H1>
        {/* </div> */}
      </Main>
    </>
  );
}

export default MainPanel;

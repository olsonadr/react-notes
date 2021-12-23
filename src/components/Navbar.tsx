import React from "react";
import styled from "@emotion/styled";
import { FaBars } from "react-icons/fa";
import logo from '../img/small_logo.png'
// import logo from './img/logo.png'

// Create styled components for the navbar (emotion.js)
const Nav = styled.nav`
  background-color: var(--bg);
  color: var(--bg-text);
  height: var(--nav-height);
  display: flex;
  justify-content: flex-start;
  position: relative;
  align-items: center;
`;

const NavLeft = styled.div`
  flex: 0 1 auto;
  position: absolute;
  left: 1rem;
`;

const NavCenter = styled.div`
  flex: 0 1 auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const NavRight = styled.div`
  flex: 0 1 auto;
  position: absolute;
  right: 1rem;
`;

const SidebarToggle = styled(FaBars)`
  font-size: 2rem;
  /* font-size: 1rem; */
  border-radius: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  background-color: var(--bg);
  &:hover {
    background-color: var(--bg-bold);
  }
`;

const NavImg = styled.img`
  width: 4rem;
  height: 4rem;
`;

function Navbar(props: {
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  sidebar: boolean;
}) {
  // Create wrapper to toggle sidebar using setState passed in props
  function toggleSidebar() { props.setSidebar(!props.sidebar); }

  return (
    <>
      <Nav>
        <NavLeft>
          <SidebarToggle onClick={toggleSidebar} />
        </NavLeft>
        <NavCenter>
          <NavImg src={logo} alt="React Notes" />
        </NavCenter>
        <NavRight>
          <h2>Right!</h2>
        </NavRight>
      </Nav>
    </>
  );
}

export default Navbar;

// Dropdown inspired by: https://www.youtube.com/watch?v=IF6k0uZuypA&list=WL&index=3
import React, { ReactComponentElement, useState } from "react";
import styled from "@emotion/styled";
import { FaBars } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import logo from "../img/small_logo.png";
import { User } from "@auth0/auth0-react";
import { Profile } from "../interfaces";

// Icons
import { ReactComponent as CaretIcon } from "../icons/caret.svg";
import { ReactComponent as CogIcon } from "../icons/cog.svg";
import { ReactComponent as ChevronIcon } from "../icons/chevron.svg";
import { ReactComponent as ArrowIcon } from "../icons/arrow.svg";
import { ReactComponent as BoltIcon } from "../icons/bolt.svg";

// Create styled components for the Navbar (emotion.js)
const Nav = styled.nav`
  background-color: var(--bg);
  color: var(--bg-text);
  height: var(--nav-height);
  display: flex;
  justify-content: flex-start;
  position: relative;
  align-items: center;
  border-bottom: var(--border);
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
  font-size: 1.5rem;
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

const NavItemS = styled(NavItem)`
  width: calc(0.8 * var(--nav-height));
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Exported Navbar react component
function Navbar(props: {
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  sidebar: boolean;
  user: User | undefined;
  auth: boolean;
  loading: boolean;
  profile: Profile | undefined;
}) {
  // Create wrapper to toggle sidebar using setState passed in props
  function toggleSidebar() {
    props.setSidebar(!props.sidebar);
  }

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
          <NavItemS className="hover-on" icon={<BsPersonCircle />}>
            <DropdownMenu></DropdownMenu>
          </NavItemS>
        </NavRight>
      </Nav>
    </>
  );
}

// Create styled components for the NavItem's (emotion.js)
const IconButton = styled.button`
  --button-size: calc(0.5 * var(--nav-height));
  font-size: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  /* width: var(--button-size);
  height: var(--button-size); */
  background-color: var(--bg-bold);
  /* background-color: var(--bg); */
  border-radius: 50%;
  padding: 5px;
  margin: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* border: var(--border); */
  border: none;
  cursor: pointer;
  &.hover-on {
    width: 2.5rem;
  }
  &.hover-on:hover {
    background-color: var(--bg-bold);
    filter: brightness(1.1);
  }
  & svg {
    fill: var(--bg-text);
    width: 1.5rem;
    height: 1.5rem;
  }
  &.right {
    margin-left: auto;
    background: none;
    border-radius: 50%;
  }
  &.right-bump {
    margin-right: 10px;
  }
  &.no-bg {
    background: none;
  }
`;

// Local NavItem react component
function NavItem(props: {
  icon: string | JSX.Element;
  children?: string | JSX.Element;
  className?: string;
}) {
  // Open or closed state
  const [open, setOpen] = useState(false);

  // Button onClick
  const click = props.children
    ? () => {
        setOpen(!open);
      }
    : () => {};

  // Return jsx for NavItem to render
  return (
    <li className="nav-item">
      <IconButton className={props.className} onClick={click}>
        {props.icon}
      </IconButton>

      {open && props.children}
    </li>
  );
}

// Create styled components for the Dropdown (emotion.js)
// Dropdown Container
const DropdownS = styled.div`
  background-color: var(--bg);
  position: absolute;
  top: calc(0.65 * var(--nav-height));
  width: 270px;
  transform: translateX(-85%);
  border: var(--border);
  border-radius: var(--border-radius);
  padding: 1rem;
  overflow: hidden;
  z-index: 2;
`;

// Dropdown Item Button/Container
const DropdownItemS = styled.button`
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: var(--border-radius);
  transition: background var(--speed);
  padding: 0.5rem;
  border: none;
  background-color: var(--bg);
  color: var(--bg-text);
  &:hover {
    background-color: var(--bg-bold);
    color: var(--bg-text-bold);
  }
`;

// Local DropdownMenu react component
function DropdownMenu(props: { children?: JSX.Element }) {
  // Return jsx for DropdownMenu to render
  return (
    <DropdownS>
      <DropdownItem>My Profile</DropdownItem>
      <DropdownItem leftIcon={<CogIcon />} rightIcon={<ChevronIcon />}>
        Settings
      </DropdownItem>
    </DropdownS>
  );
}

 // Local DropdownItem react component
  function DropdownItem(props: {
    leftIcon?: string | JSX.Element;
    rightIcon?: string | JSX.Element;
    children?: string | JSX.Element;
  }) {
    // Return jsx for DropdownMenu to render
    return (
      <DropdownItemS>
        {/* <IconButton className="right-bump">{props.leftIcon}</IconButton> */}
        {props.leftIcon ? (
          <IconButton className="right-bump">{props.leftIcon}</IconButton>
        ) : (
          <IconButton className="no-bg right-bump"></IconButton>
        )}

        {props.children}

        {props.rightIcon && (
          <IconButton className="right">{props.rightIcon}</IconButton>
        )}
        
      </DropdownItemS>
    );
  }

export default Navbar;

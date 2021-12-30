// Dropdown inspired by: https://www.youtube.com/watch?v=IF6k0uZuypA&list=WL&index=3
// Icons
import { ReactComponent as CogIcon } from "../icons/cog.svg";
import { ReactComponent as ChevronIcon } from "../icons/chevron.svg";
import { ReactComponent as ArrowIcon } from "../icons/arrow.svg";
// import { ReactComponent as CaretIcon } from "../icons/caret.svg";
// import { ReactComponent as BoltIcon } from "../icons/bolt.svg";

// Normal Imports
import React, { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import styled from "@emotion/styled";
import { FaBars, FaPlus } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import logo from "../img/small_logo.png";
import { User } from "@auth0/auth0-react";
import { Profile } from "../interfaces";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { Socket } from "socket.io-client";

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
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
  align-items: center;
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
  margin-right: 0.5rem;
  cursor: pointer;
  background-color: var(--bg);
  &:hover {
    background-color: var(--bg-bold);
  }
`;

const AddNoteButton = styled(FaPlus)`
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
  height: var(--nav-button-size);
  width: var(--nav-button-size);
  display: flex;
  align-items: center;
  justify-content: center;
  & img {
    font-size: 10px;
    border-radius: 50%;
    height: var(--nav-button-size);
    width: var(--nav-button-size);
    border: var(--border);
  }
`;

// Exported Navbar react component
function Navbar(props: {
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  sidebar: boolean;
  user: User | undefined;
  auth: boolean;
  loading: boolean;
  profile: Profile | undefined;
  socket: Socket;
}) {
  // Create wrapper to toggle sidebar using setState passed in props
  function toggleSidebar() {
    props.setSidebar(!props.sidebar);
  }

  // Create addNote function
  function addNote() {
    console.log('Hit the add button!');
    if (props.socket && props.user && props.user.sub && !props.loading) {
      props.socket.emit("add_note", {user_id: props.user.sub, name: "New Note", data: ""});
    }
    return;
  }

  // The icon to use for the dropdown button
  const [dropdownImgReady, setDropdownImgReady] = useState(false);

  useEffect(() => {
    if (props.profile && props.profile.picture) {
      const img = new Image();
      img.onload = () => {
        // When it finishes loading, update the component state
        setDropdownImgReady(true);
      };
      img.src = props.profile.picture;
    }
  }, [props.profile]);

  const dropdownIcon =
    dropdownImgReady && props.profile && props.profile.picture ? (
      // props.profile && props.profile.picture ? (
      <img src={props.profile.picture} alt="Dropdown Button" />
    ) : (
      <BsPersonCircle />
    );

  // Whether we are logged in state for children
  const loggedIn: boolean =
    props.auth && props.user && !props.loading ? true : false;

  // Prevent dragging handler
  const preventDragHandler = (e: any) => {
    e.preventDefault();
  };

  return (
    <>
      <Nav>
        <NavLeft>
          <SidebarToggle onClick={toggleSidebar} />
          <AddNoteButton onClick={addNote} />
        </NavLeft>
        <NavCenter>
          <NavImg
            src={logo}
            alt="React Notes"
            onDragStart={preventDragHandler}
          />
        </NavCenter>
        <NavRight>
          <NavItemS className="hover-on" icon={dropdownIcon}>
            <DropdownMenu loggedIn={loggedIn}></DropdownMenu>
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
  height: var(--button-size);
  width: var(--button-size);
  background-color: var(--bg-bold);
  border-radius: 50%;
  padding: 5px;
  margin: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  &.hover-on:hover {
    background-color: var(--bg-bold);
    filter: brightness(1.1);
  }
  & svg {
    fill: var(--bg-text);
    color: var(--bg-text);
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

  // Give props.children the Dropdown toggler function
  const childrenWithProps = React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      // @ts-ignore: Props type not checked correctly
      return React.cloneElement(child, { dropdownToggle: click });
    }
  });

  // Return jsx for NavItem to render
  return (
    <li className="nav-item">
      <IconButton className={props.className} onClick={click}>
        {props.icon}
      </IconButton>

      {open && childrenWithProps}
    </li>
  );
}

// Create styled components for the Dropdown (emotion.js);
// z=[10,19], so should be in front of content (z=[0,9])
//  but in front of other popups (z=[20,29]);
const DropdownS = styled.div`
  --ratio: calc(var(--nav-button-ratio) + 0.165);
  top: calc(var(--ratio) * var(--nav-height));
  right: 0;
  background-color: var(--bg);
  position: absolute;
  width: var(--dropdown-width);
  border: var(--border);
  border-radius: var(--border-radius);
  padding: var(--dropdown-padding);
  z-index: 11;
  overflow: hidden;
  transition: height var(--speed) ease;
`;

// Create styled component that wraps the dropdown menu and gives
//  a little triangle hint pseudo-element above the menu
const DropdownWrapperS = styled.div`
  /* Little arrow above dropdown pointing to source button */
  &::after {
    position: absolute;
    left: auto;
    --ratio: calc(var(--nav-button-ratio) + 0.15);
    top: calc(var(--ratio) * var(--nav-height) - 6px);
    right: calc(0.5 * var(--nav-button-size) - 5px);
    content: "";
    /* background-clip: padding-box; */
    padding: 7px;
    transform: rotate(45deg);
    z-index: 12;

    background-color: var(--bg);
    border: var(--border);
    border-bottom-color: transparent;
    border-right-color: transparent;
  }
`;

// Create styled component for the click barrier that sits behind the dropdown
const DropdownClickBarrier = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
`;

// Dropdown menu transition container
const DropdownTransitionDiv = styled.div`
  width: var(--dropdown-width);
  /* Transition stuff */
  &.menu-primary-enter {
    position: absolute;
    transform: translateX(-110%);
  }
  &.menu-primary-enter-active {
    transform: translateX(0%);
    transition: all var(--speed) ease;
  }
  &.menu-primary-exit {
    position: absolute;
  }
  &.menu-primary-exit-active {
    transform: translateX(-110%);
    transition: all var(--speed) ease;
  }
  &.menu-secondary-enter {
    transform: translateX(110%);
  }
  &.menu-secondary-enter-active {
    transform: translateX(0%);
    transition: all var(--speed) ease;
  }
  &.menu-secondary-exit {
  }
  &.menu-secondary-exit-active {
    transform: translateX(110%);
    transition: all var(--speed) ease;
  }
`;

// Dropdown Item Button/Container
// const DropdownItemS = styled.button`
const DropdownItemS = styled.div`
  height: var(--nav-dd-button-height);
  width: calc(var(--dropdown-width) - var(--dropdown-padding));
  display: flex;
  align-items: center;
  border-radius: var(--border-radius);
  transition: background var(--speed);
  padding: var(--nav-dd-button-padding);
  border: none;
  background-color: var(--bg);
  cursor: pointer;
  color: var(--bg-text);
  &:hover {
    background-color: var(--bg-bold);
    color: var(--bg-text-bold);
  }
`;

// Local DropdownMenu react component
function DropdownMenu(props: {
  loggedIn?: boolean;
  dropdownToggle?: () => {};
  children?: JSX.Element;
}) {
  // Establish state for which submenu is open
  const [activeMenu, setActiveMenu] = useState("main");

  // Establish state for menu height for animations
  // const [menuHeight, setMenuHeight] = useState<string | number | null>(null);
  const [menuHeight, setMenuHeight] = useState<string | number | undefined>(
    undefined
  );

  // Establish nodeRef for CSSTransition
  const nodeRefMain: React.MutableRefObject<any> = React.useRef(null);
  const nodeRefSettings: React.MutableRefObject<any> = React.useRef(null);

  // Establish function to get the current menuHeight
  function calcHeight() {
    let height = undefined;
    let currRef;
    currRef =
      activeMenu === "main" && nodeRefMain && nodeRefMain.current
        ? nodeRefMain.current
        : currRef;
    currRef =
      activeMenu === "settings" && nodeRefSettings && nodeRefSettings.current
        ? nodeRefSettings.current
        : currRef;
    height = currRef ? currRef.offsetHeight : height;
    setMenuHeight(height);
  }
  useEffect(() => {
    // Use useEffect to do this once with default dropdown menu selection
    calcHeight();
  });

  // Login/Logout button in dropdown depending on auth state
  const LogInOutButton = props.loggedIn ? (
    <LogoutButton className="hover-on transition-bg nav-dd-style" />
  ) : (
    <LoginButton className="hover-on transition-bg nav-dd-style" />
  );

  // Return jsx for DropdownMenu to render
  return (
    <>
      <DropdownWrapperS>
        <DropdownS style={{ height: menuHeight }}>
          <CSSTransition
            in={activeMenu === "main"}
            unmountOnExit
            timeout={50000}
            classNames="menu-primary"
            nodeRef={nodeRefMain}
            onEnter={calcHeight}
          >
            <DropdownTransitionDiv
              className="menu menu-primary"
              ref={nodeRefMain}
            >
              <DropdownItem>My Profile</DropdownItem>
              <DropdownItem
                leftIcon={<CogIcon />}
                rightIcon={<ChevronIcon />}
                goToMenu="settings"
                setActiveMenu={setActiveMenu}
              >
                Settings
              </DropdownItem>
              {LogInOutButton}
            </DropdownTransitionDiv>
          </CSSTransition>

          <CSSTransition
            in={activeMenu === "settings"}
            unmountOnExit
            timeout={500}
            classNames="menu-secondary"
            nodeRef={nodeRefSettings}
            onEnter={calcHeight}
          >
            <DropdownTransitionDiv
              className="menu menu-secondary"
              ref={nodeRefSettings}
            >
              <DropdownItem
                leftIcon={<ArrowIcon />}
                goToMenu="main"
                setActiveMenu={setActiveMenu}
              ></DropdownItem>
              <DropdownItem>Setting 1</DropdownItem>
              <DropdownItem>Setting 2</DropdownItem>
            </DropdownTransitionDiv>
          </CSSTransition>
        </DropdownS>
      </DropdownWrapperS>
      <DropdownClickBarrier onClick={props.dropdownToggle} />
    </>
  );
}

// Local DropdownItem react component
function DropdownItem(props: {
  leftIcon?: string | JSX.Element;
  rightIcon?: string | JSX.Element;
  children?: string | JSX.Element;
  setActiveMenu?: React.Dispatch<React.SetStateAction<string>>;
  goToMenu?: string;
}) {
  // Return jsx for DropdownMenu to render
  return (
    <DropdownItemS
      onClick={() => {
        props.goToMenu &&
          props.setActiveMenu &&
          props.setActiveMenu(props.goToMenu);
      }}
    >
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

// Dropdown inspired by: https://www.youtube.com/watch?v=IF6k0uZuypA&list=WL&index=3
// Icons
import { ReactComponent as CaretIcon } from "../icons/caret.svg";
import { ReactComponent as CogIcon } from "../icons/cog.svg";
import { ReactComponent as ChevronIcon } from "../icons/chevron.svg";
import { ReactComponent as ArrowIcon } from "../icons/arrow.svg";
import { ReactComponent as BoltIcon } from "../icons/bolt.svg";

// Normal Imports
import React, { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import styled from "@emotion/styled";
import { FaBars } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import logo from "../img/small_logo.png";
import { User } from "@auth0/auth0-react";
import { Profile } from "../interfaces";

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
  background-color: var(--bg);
  position: absolute;
  top: calc(0.65 * var(--nav-height));
  width: var(--dropdown-width);
  transform: translateX(-85%);
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
    right: 14px;
    top: calc(0.65 * var(--nav-height) - 8px);
    /* right: 15px; */
    /* top: -8px; */
    content: "";
    background-clip: padding-box;
    padding: 7px;
    transform: rotate(45deg);
    box-shadow: -9px 0 7pba (27, 31, 35, 0.6);
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
  height: 40px;
  width: calc(var(--dropdown-width) - var(--dropdown-padding));
  display: flex;
  align-items: center;
  border-radius: var(--border-radius);
  transition: background var(--speed);
  padding: 0.5rem;
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
  dropdownToggle?: () => {};
  children?: JSX.Element;
}) {
  // Establish state for which submenu is open
  const [activeMenu, setActiveMenu] = useState("main");
  
  // Establish state for menu height for animations
  // const [menuHeight, setMenuHeight] = useState<string | number | null>(null);
  const [menuHeight, setMenuHeight] = useState<string | number | undefined>(undefined);
  
  // Establish nodeRef for CSSTransition
  const nodeRefMain: React.MutableRefObject<any> = React.useRef(null);
  const nodeRefSettings: React.MutableRefObject<any> = React.useRef(null);
  
  // Establish function to get the current menuHeight
  function calcHeight() {
    let height = undefined;
    let currRef;
    currRef = activeMenu === "main" && nodeRefMain && nodeRefMain.current ? nodeRefMain.current : currRef;
    currRef = activeMenu === "settings" && nodeRefSettings && nodeRefSettings.current ? nodeRefSettings.current : currRef;
    height = currRef ? currRef.offsetHeight : height;
    setMenuHeight(height);
  }
  useEffect(() => {
    // Use useEffect to do this once with default dropdown menu selection
    calcHeight();
  });

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

import { Fragment, useState } from "react";
import { Link } from "react-router-dom";

import { Backdrop } from "../UIElements/Backdrop";
import { MainHeader } from "./MainHeader";
import { NavLinks } from "./NavLinks";
import { SideDrawer } from "./SideDrawer";

import "./MainNavigation.css";

const MainNavigation = () => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const toggleDrawer = () => setDrawerIsOpen(!drawerIsOpen);

  return (
    <Fragment>
      {drawerIsOpen && <Backdrop onClick={toggleDrawer} />}
      <SideDrawer show={drawerIsOpen} onClick={toggleDrawer}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>

      <MainHeader>
        <button className="main-navigation__menu-btn" onClick={toggleDrawer}>
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to={"/"} style={{ textDecoration: "none" }} />
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </Fragment>
  );
};

export default MainNavigation
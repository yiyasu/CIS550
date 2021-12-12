import React from "react";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "shards-react";

class MenuBar extends React.Component {
  render() {
    return (
      <Navbar type="dark" theme="primary" expand="md">
        <NavbarBrand href="/">Boston AirBnB</NavbarBrand>
        <Nav navbar>
          <NavItem>
            <NavLink active href="/">
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink active href="/listings">
              Listings
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink active href="/hosts">
              Hosts
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default MenuBar;

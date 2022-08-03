import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./App.css";

export default function Header() {
  return (
    <Navbar
      collapseOnSelect
      expand="xl"
      className="p-4"
      bg="dark"
      variant="dark"
      fixed="top"
    >
      <Container>
        <Navbar.Brand>
          <Link to="/" className="home-link">
            Eth-Parking
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <Nav.Link>
              <Link to="/login" state={{ from: "user" }} className="link">
                Park a Vehicle
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link to="/login" state={{ from: "owner" }} className="link">
                Create a Parking Lot
              </Link>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

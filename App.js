import React from 'react';
import { Outlet } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';


export default function App() {
  return (
    <>
    <Navbar collapseOnSelect expand="md" bg="dark" variant="dark" className="text-white">
      <Container fluid>
        <Navbar.Brand href="/#home" className="fst-italic">React Tutorial Product</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="justify-content-end flex-grow-1 pe-3">
            <Nav.Link href="/Game">tic-tac-toe<Badge pill bg="info">myself</Badge></Nav.Link> 
            <Nav.Link target="_blank" href="https://reactjs.org/tutorial/tutorial.html">React Tutorial</Nav.Link>
            <Nav.Link target="_blank" href="https://reactrouter.com/en/main/getting-started/tutorial">React Router Tutorial</Nav.Link>
            <Nav.Link target="_blank" href="https://react-bootstrap.github.io/">React Bootstrap</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <Outlet />
    </>
  );
}
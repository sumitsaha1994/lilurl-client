import React from "react";
import { Navbar, Dropdown, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import API_URL from "../api";

const NavBar = (props) => {
    const { user } = props;
    const history = useHistory();
    const handleLogout = () => {
        fetch(`${API_URL}/users/logout`, {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => history.push("/user/login"));
    };
    return (
        <div>
            <Navbar bg="dark" expand="lg" variant="dark">
                <Navbar.Brand as={Link} to="/">
                    <strong>Lilurl</strong>
                </Navbar.Brand>
                {/* <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto ml-auto">
                            <Nav.Link as={Link} href="#home">
                                Home
                            </Nav.Link>
                            <Nav.Link as={Link} href="#link">
                                Link
                            </Nav.Link>
                        </Nav>
                        <Button variant="success">Logout</Button>
                    </Navbar.Collapse> */}
                {Object.entries(user).length > 0 && (
                    <Dropdown className="ml-auto">
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {user.firstName || user.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user.userId}
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{ left: "auto", right: "0px" }}>
                            <Dropdown.Item as={Link} to="/user/editProfile">
                                Edit profile
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="/user/linksDirectory">
                                View links directory
                            </Dropdown.Item>
                            <Dropdown.Item>
                                <Button variant="dark" onClick={handleLogout} block>
                                    Log out
                                </Button>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                )}
            </Navbar>
        </div>
    );
};

export default NavBar;

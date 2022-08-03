import Button from "@restart/ui/esm/Button";
import React from "react";
import { Col, Form, Row, Modal } from "react-bootstrap";

import Axios from "axios";
import { useState } from "react";

import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Web3 from "web3";
import { INFURANET_URL, PORT } from "./constants";

export default function Register() {
  const web3 = new Web3(INFURANET_URL);
  const location = useLocation();

  //State variables that store registration information of user
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isModalOpen, setModalIsOpen] = useState(false);

  const [accuntPublicAddress, setAccuntPublicAddress] = useState("");
  const [accuntPrivateAddress, setAccuntPrivateAddress] = useState("");

  //onChange listener for email
  function emailChanged(e) {
    const email_val = e.target.value;
    setEmail(email_val);
  }

  //onChange listener for password
  function passwordChanged(e) {
    const pass_val = e.target.value;
    setPass(pass_val);
  }

  //When user click on register button
  function registerUser(e) {
    e.preventDefault();

    //endpoint to register user
    let URL = "";
    if (location.state.from === "owner") {
      URL = `http://localhost:${PORT}/api/registerOwner`;
    } else if (location.state.from === "user") {
      URL = `http://localhost:${PORT}/api/registerUser`;
    }

    let account = web3.eth.accounts.create();

    if (account) {
      setAccuntPrivateAddress(account.privateKey);
      setAccuntPublicAddress(account.address);

      console.log(account.address);
      Axios.post(`${URL}`, {
        email: email,
        password: pass,
        publicAddress: account.address,
        privateAddress: account.privateKey,
      }).then((resp) => {
        if (resp.data.success) {
          openModal();
        } else {
          alert("User with this email already exists");
          setEmail("");
          setPass("");
        }
      });
    }
  }

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  return (
    <div style={{ marginTop: "120px" }}>
      <div style={{ width: "100%", textAlign: "center" }}>
        {location.state.from === "user" ? (
          <h1>Be the member! Park your Vehicles</h1>
        ) : (
          <h1>Register Now! Utilize your empty plots</h1>
        )}
      </div>
      <Row>
        <Col xs={12} md={{ span: 6, offset: 3 }}>
          <Form className="border p-4 mt-4 shadow-sm">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={emailChanged}
                value={email}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={passwordChanged}
                value={pass}
              />
            </Form.Group>

            <Button variant="primary" onClick={registerUser}>
              Register
            </Button>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className="mt-4">
                <Link to="/login" state={{ from: location.state.from }}>
                  Already have an account? Login here.
                </Link>
              </Form.Label>
            </Form.Group>
          </Form>
        </Col>
      </Row>

      {/* Modal */}
      <Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>VERY IMPORTANT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="border p-4 mt-4 shadow-sm">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>ACCOUNT ADDRESS</Form.Label>
              <p>{accuntPublicAddress}</p>
            </Form.Group>
            <br />
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>PRIVATE KEY</Form.Label>
              <p>{accuntPrivateAddress}</p>
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

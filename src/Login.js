import Button from "@restart/ui/esm/Button";
import React from "react";
import Axios from "axios";

import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { PORT } from "./constants";

export default function Login() {

  const location = useLocation();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const navigate = useNavigate();

  function emailChanged(e) {
    const email_val = e.target.value;
    setEmail(email_val);
  }

  function passwordChanged(e) {
    const pass_val = e.target.value;
    setPass(pass_val);
  }

  function loginUser(e) {
    e.preventDefault();

    let URL = "";

    if (location.state.from === "owner") {
      URL = `http://localhost:${PORT}/api/loginOwner`;
    } else if (location.state.from === "user") {
      URL = `http://localhost:${PORT}/api/loginUser`;
    }

    Axios.post(`${URL}`, { email: email, password: pass }).then((resp) => {
      if (resp.data.success) {
        if (location.state.from === "user") {
          navigate("/availableLots", {
            state: {
              data: resp.data.data,
            },
          });
        } else if (location.state.from === "owner") {
          navigate("/lotOwnerPage", {
            state: {
              data: resp.data.data,
            },
          });
        }
      } else {
        alert("Incorrect email and password combination!");
        setEmail("");
        setPass("");
      }
    });
  }

  return (
    <div style={{ marginTop: "120px" }}>
      <div style={{ width: "100%", textAlign: "center" }}>
        {location.state.from === "user" ? (
          <h1>Just One step away! Park your Vehicles</h1>
        ) : (
          <h1>Login to account</h1>
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
            <Button onClick={loginUser}>Login</Button>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className="mt-4">
                <Link to="/register" state={{ from: location.state.from }}>
                  Don't Have an Account? Create One.
                </Link>
              </Form.Label>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

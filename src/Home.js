import React from "react";
import { Row, Col } from "react-bootstrap";
import homeImage from "./images/parking.png";

export default function Home() {
  return (
    <div style={{ paddingTop: "120px", width: "100%" }}>
      <div style={{ width: "100%", textAlign: "center" }}>
        <h1>Ethereum based Vehicle Parking System</h1>
      </div>

      <Row>
        <Col xs={12} md={{ span: 5, offset: 1 }}>
          <img src={homeImage} alt="Loading Image ... " width={"100%"} />
        </Col>
        <Col xs={12} md={{ span: 6 }} className="mt-4">
          <div
            style={{ width: "100%", textAlign: "center", paddingTop: "50px" }}
          >
            <h1 className="text-primary">How It Works?</h1>
          </div>
          <div style={{ width: "100%", marginLeft: "150px" }}>
            <ol>
              <li>
                <h3 className="text-danger mb-4 mt-2">Create account as plot owner</h3>

                <ul>
                  <li>
                    Login to your account
                    <ol>
                      <li>Check your balance</li>
                      <li>Add new lot on Blockchain</li>
                      <li>See your created lots</li>
                    </ol>
                  </li>
                </ul>
              </li>
              <li>
                <h3 className="text-danger mb-4 mt-2">
                  Create account as Driver/Plot User
                </h3>

                <ul>
                  <li>
                    Login to your account
                    <ol>
                      <li>Check your balance</li>
                      <li>See all available parking lots</li>
                      <li>Book a lot for your vehicle</li>
                    </ol>
                  </li>
                </ul>
              </li>
            </ol>
          </div>
        </Col>
      </Row>
    </div>
  );
}

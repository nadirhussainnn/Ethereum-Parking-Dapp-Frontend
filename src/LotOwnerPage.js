import React, { useState, useEffect } from "react";
import Web3 from "web3";

import { useNavigate } from "react-router-dom";
import { Col, Row, Card, Button } from "react-bootstrap";
import { INFURANET_URL, CONTRACT_ADDRESS } from "./constants";
import { useLocation } from "react-router-dom";
import { images } from "./images";
import ParkingABI from "./contracts/Parking.json"

import OwnerLotTemplate from "./OwnerLotTemplate";

export default function LotOwnerPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const web3 = new Web3(INFURANET_URL);
  const [balance, setBalance] = useState("");
  const [availableLots, setAvailableLots] = useState([]);

  //Load balance of user, and all lots from our contract

  useEffect(() => {
    const contract = new web3.eth.Contract(ParkingABI, CONTRACT_ADDRESS);

    contract.methods
      .getParking()
      .call()
      .then((result) => {
        setAvailableLots(result);
      });

    web3.eth.getBalance(location.state.data.public_address, (error, b) => {
      if (b) {
        setBalance(web3.utils.fromWei(b, "ether"));
      } else {
        setBalance("Loading Balance ...");
      }
    });
  }, []);

  function createLot() {
    navigate("/createParkingLot", {
      state: {
        owner: location.state.data, //send owner details to perform transaction for adding lot to Blockchain
      },
    });
  }

  return (
    <div style={{ marginTop: "120px" }}>
      <div style={{ width: "100%", textAlign: "center" }}>
        <h1>Owner Dashboard</h1>
      </div>

      <Row>
        <Col xs={12} md={{ span: 6, offset: 3 }}>
          <Card border="danger" className="mt-3">
            <Card.Header>Account Details</Card.Header>
            <Card.Body>
              <Card.Text>
                <p>
                  <b>Private Key: </b>
                  {location.state.data.private_address}
                  <br />
                  <b>Public address: </b>
                  {location.state.data.public_address}
                  <br />
                  <b>Balance: </b>
                  {balance + " "}ETH
                </p>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <hr></hr>
      <Row>
        <Col xs={12} md={{ span: 6, offset: 3 }}>
          <Button variant="primary" onClick={createLot}>
            Create a Parking Lot
          </Button>
        </Col>
      </Row>

      <hr />
      <div style={{ width: "100%", textAlign: "center" }}>
        <h1>My Parking Lots</h1>
      </div>
      <Row>
        <Col xs={12} md={{ span: 8, offset: 2 }}>
          <Row>
            {availableLots ? (
              availableLots.map((lot, ind) => {
                if (lot.lotOnwerAddress == location.state.data.public_address && lot.vacancy>0) {
                  return (
                    <Col xs={12} md={{ span: 3, offset: 0 }}>
                      <OwnerLotTemplate
                        price={lot.lotPrice}
                        vacancy={lot.vacancy}
                        description={lot.lotDescription}
                        location={lot.lotLocation}
                        image={images[ind]}
                      />
                    </Col>
                  );
                } else {
                  return "";
                }
              })
            ) : (
              <h1>Loading lots from Blockchain...</h1>
            )}
          </Row>
        </Col>
      </Row>
    </div>
  );
}

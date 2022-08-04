import React, { useState, useEffect } from "react";
import Web3 from "web3";

import { Col, Row, Card } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { INFURANET_URL, CONTRACT_ADDRESS } from "./constants";
import { images } from "./images";

import ParkingABI from './contracts/Parking.json'
import LotTemplate from "./LotTemplate";


export default function AvailableLots() {

  const location = useLocation();

  const web3 = new Web3(INFURANET_URL);
  const [balance, setBalance] = useState("");
  const[availableLots, setAvailableLots]=useState([])

  //Load balance of user, and all lots from our contract

  useEffect(() => {

    const contract = new web3.eth.Contract(
      ParkingABI,
      CONTRACT_ADDRESS
    );

    contract.methods.getParking().call().then((result)=>{
        setAvailableLots(result)
    })

    web3.eth.getBalance(location.state.data.public_address, (error, b) => {
      if (b) {
        setBalance(web3.utils.fromWei(b, "ether"));
      } else {
        setBalance("Loading Balance ...");
      }
    });
  }, []);

  return (
    <div style={{ marginTop: "120px" }}>
      <Row>
        <Col xs={12} md={{ span: 6, offset: 3 }}>
          <Card border="danger" className="mt-3">
            <Card.Header>Account Details</Card.Header>
            <Card.Body>
              <Card.Text>
                <p>
                  {/* <b>Private Key: </b>
                  {location.state.data.private_address}
                  <br /> */}
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
      <div style={{ width: "100%", textAlign: "center" }}>
        <h1>Available Parkings Slots</h1>
      </div>
      <Row>
        <Col xs={12} md={{ span: 8, offset: 2 }}>
          <Row>
            {availableLots?availableLots.map((lot, ind) => {
              // console.log(lot)
              if(lot.vacancy>0){
                return (
                
                  <Col xs={12} md={{ span: 3, offset: 0 }}>
                    <LotTemplate
                      price={lot.lotPrice}
                      vacancy={lot.vacancy}
                      description={lot.lotDescription}
                      location={lot.lotLocation}
                      image={images[ind]}
                      id={lot.lotId}
                      userPublicKey={location.state.data.public_address}
                      userPrivateKey={location.state.data.private_address}
                      ownerPublicKey={lot.lotOnwerAddress}
                    />
                  </Col>
                );
              }
              else{
                return "";
              }
            }):<h3>"Loading Lots ....</h3>}
          </Row>
        </Col>
      </Row>
    </div>
  );
}

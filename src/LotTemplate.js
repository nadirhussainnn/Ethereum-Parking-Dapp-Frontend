import React from "react";

import { Card, Button } from "react-bootstrap";
import Web3 from "web3";
import { INFURANET_URL } from "./constants";

import Axios from "axios";
import { PORT } from "./constants";
//import EthereumTx from "ethereumjs-tx";

export default function LotTemplate(props) {
  const price = props.price;
  const vacancy = props.vacancy;
  const description = props.description;
  const location = props.location;
  const image = props.image;
  const lotId = props.id;

  const lotUserPublicKey = props.userPublicKey;
  const lotUserPrivateKey = props.userPrivateKey;
  const lotOwnerPublicAddress = props.ownerPublicKey;

  const web3 = new Web3(INFURANET_URL);

  let URL = `http://localhost:${PORT}/api/sendTransaction`;

  //TODO: UPDATE Vacancy on Blockchain after lot is booked

  function parkVehicleOnSelectedLot() {
    // console.log(lotOwnerAddress+" "+lotUser);

    //Check if balance is more than price
    web3.eth.getBalance(lotUserPublicKey, (error, b) => {
      if (b) {
        const balance = web3.utils.fromWei(b, "ether");
        if (balance > price) {
          //Call API here

          Axios.post(`${URL}`, {
            senderPublicKey: lotUserPublicKey,
            senderPrivateKey: lotUserPrivateKey,
            receiverPublicKey: lotOwnerPublicAddress,
            amount: price,
          }).then((resp) => {
            const bookingTransactionHash = resp.data.transactionHash;
            if (bookingTransactionHash) {
              console.log("Booking tx Hash: "+bookingTransactionHash);
              //                  alert("You have booked lot successfully\nTransaction Hash is:\n"+resp.data.transactionHash)

              URL=`http://localhost:${PORT}/api/updateVacancy`;

              Axios.post(`${URL}`, {
                senderPublicKey: lotUserPublicKey,
                senderPrivateKey: lotUserPrivateKey,
                lotId:lotId
              }).then((resp) => {

                const vacancyUpdateTransactionHash=resp.data.transactionHash;
                if (vacancyUpdateTransactionHash) {
                  console.log("Booking tx Hash: "+bookingTransactionHash);
                  alert("You have booked parking successfully!");
                }
              });
            
            } else {
              alert("Error occured, Try again");
            }
          });
        } else {
          alert(
            `Insufficient balance- Required ${price} but available only ${balance}`
          );
        }
      }
    });
  }

  return (
    <Card border="primary" className="mt-3">
      <Card.Header>Price per Vacancy: {price} ETH</Card.Header>
      <Card.Img variant="top" src={image} />
      <Card.Body>
        <Card.Title>{location}</Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">Vacancy: {vacancy}</small>
      </Card.Footer>
      <Button
        className="btn btn-success ml-auto"
        onClick={parkVehicleOnSelectedLot}
      >
        Park NOW
      </Button>
    </Card>
  );
}

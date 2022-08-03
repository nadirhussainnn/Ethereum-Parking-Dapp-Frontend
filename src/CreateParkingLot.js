import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import {Row,Col, Form, Button} from "react-bootstrap"

import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Axios from "axios";
import { PORT } from "./constants";


export default function CreateParkingLot() {

    const location = useLocation();
    const navigate = useNavigate();

    
    const[lotLocation, setLotLocation]=useState("");
    const[pricePervacancy, setPricePerVacancy]=useState("");
    const[lotDesc, setLotDesc]=useState("")
    const[lotVacancy, setLotVacancy]=useState("")
    
    function descriptionChanged(e){
        e.preventDefault();
        setLotDesc(e.target.value);
    }

    function locationChanged(e){
        e.preventDefault();
        setLotLocation(e.target.value);
    }

    function vacancyChanged(e){
        e.preventDefault();
        setLotVacancy(e.target.value);
    }

    function pricePervacancyChanged(e){
        e.preventDefault();
        setPricePerVacancy(e.target.value);
    }

    function publishLotToBlockchain(){

        const uuid=uuidv4()

      //Call API to add ParkingLot

      const URL = `http://localhost:${PORT}/api/addParkingLot`;

      Axios.post(`${URL}`, { 
                
        ownerAddress: location.state.owner.public_address, 
        lotId: uuid,
        price: pricePervacancy, 
        location: lotLocation,
        description: lotDesc,
        vacancy:lotVacancy,
        privateKey:location.state.owner.private_address

      }).then((resp) => {
        if (resp.data.transactionHash) {
  
          console.log(resp.data.transactionHash)
          alert("Created Parking lot successfully\nTxHash: "+resp.data.transactionHash)
    
        } else {
          alert("Error occured, Try again");
        }
      });

    }    

    function goBackToDashboard(){
        navigate('/lotOwnerPage', {
            state:{
                data:location.state.owner       //When going back, send owner details to update Dashboard infor
            }
        });
    }

  return (
    <div style={{ marginTop: "120px" }}>
      <div style={{ width: "100%", textAlign: "center" }}>
        <h1>Provide Lot information</h1>
      </div>
      <Row>
        <Col xs={12} md={{ span: 6, offset: 3 }}>
          <Form className="border p-4 mt-4 shadow-sm">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Lot Location</Form.Label>
              <Form.Control
                type="text"
                required
                onChange={locationChanged}
                value={lotLocation}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Lot Description</Form.Label>
              <Form.Control
                type="text"
                required
                onChange={descriptionChanged}
                value={lotDesc}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Lot Vacancy</Form.Label>
              <Form.Control
                type="number"
                required
                onChange={vacancyChanged}
                value={lotVacancy}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Price per vacancy- ETH</Form.Label>
              <Form.Control
                type="number"
                required
                onChange={pricePervacancyChanged}
                value={pricePervacancy}
              />
            </Form.Group>

            <Button onClick={publishLotToBlockchain}>
              Confirm
            </Button>

            <Button onClick={goBackToDashboard}>
              Back to Dashboard
            </Button>

          </Form>
        </Col>
      </Row>
    </div>
  );
}

import React from 'react'

import { Card } from 'react-bootstrap'

export default function LotTemplate(props) {

    const price=props.price;
    const vacancy=props.vacancy;
    const description=props.description;
    const location=props.location;
    const image=props.image;


  return (

    <Card border="primary" className="mt-3">
        <Card.Header>Price per vacancy: {price} ETH</Card.Header>
      <Card.Img variant="top" src={image} />
      <Card.Body>
        <Card.Title>{location}</Card.Title>
        <Card.Text>
        {description}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">Vacancy: {vacancy}</small>
      </Card.Footer>
    </Card>
    )
}

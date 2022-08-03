import React, { Component } from "react";

import Header from "./Header";
import Login from "./Login";
import Register from "./Register";
import AvailableLots from "./AvailableLots";
import Home from "./Home";
import CreateParkingLot from "./CreateParkingLot";
import LotOwnerPage from "./LotOwnerPage";

import 'bootstrap/dist/css/bootstrap.min.css';

import {BrowserRouter as Router, Routes, Route} from "react-router-dom"


class App extends Component {

  render() {
    return (
      <Router>
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/register" element={<Register />}></Route>
          <Route exact path="/availableLots" element={<AvailableLots />}></Route>
          <Route exact path="/lotOwnerPage" element={<LotOwnerPage />}></Route>
          <Route exact path="/createParkingLot" element={<CreateParkingLot />} ></Route>
        </Routes>
      </Router>
      
    );
  }
}

export default App;
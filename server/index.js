const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const Tx = require("ethereumjs-tx").Transaction;
const Web3 = require("web3");
const dotenv=require('dotenv')
const mongoose=require('mongoose')

dotenv.config()

//Some constants
const INFURANET_URL= process.env.INFURANET_URL;
const PORT=process.env.PORT || 8082;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const DB_URL=process.env.MONGO_DB_URL;

const ParkingABI = require("./ABI.json");

const web3 = new Web3(INFURANET_URL);

mongoose.connect()

//Set database configuration
const conString = {
  host: "localhost",
  user: "root",
  password: "",
  database: "parking_system_db",
};

//open connection to configured database
const con = mysql.createConnection(conString);

//allow app to use cors and response to be in json format
app.use(cors());
app.use(express.json());

app.post("/api/loginUser", (req, res) => {
  const email = req.body.email;
  const pass = req.body.password;

    console.log('Comes')
  //execute query, it will return results in callback
  con.query(
    `SELECT * from slot_users WHERE email= ? AND password= ?`,
    [email, pass],
    (err, row, col) => {
      if (err) {
        res.send("Network error occured!");
      }
      if (row && row.length > 0) {
        res.send(JSON.stringify({ success: true, data: row[0] }));
      } else res.send({ success: false });
    }
  );
});

app.post("/api/loginOwner", (req, res) => {
  const email = req.body.email;
  const pass = req.body.password;

  //execute query, it will return results in callback
  con.query(
    `SELECT * from slot_ownsers WHERE email= ? AND password= ?`,
    [email, pass],
    (err, row, col) => {
      if (err) {
        res.send("Network error occured!");
      }
      if (row && row.length > 0) {
        console.log(row);
        res.send(JSON.stringify({ success: true, data: row[0] }));
      } else res.send({ success: false });
    }
  );
});

//endpoint for user registration,
app.post("/api/registerUser", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const publicAddress = req.body.publicAddress;
  const privateAddress = req.body.privateAddress;

  //execute query
  con.query(
    "INSERT INTO slot_users VALUES (?, ?, ?, ?) ",
    [email, password, publicAddress, privateAddress],
    (err, result) => {
      if (err) {
        res.send(JSON.stringify({ success: false }));
      } else {
        //If query executes successfully, then return true in response, else false
        res.send(
          JSON.stringify({
            success: true,
          })
        );
      }
    }
  );
});

//endpoint for plot owner registration,
app.post("/api/registerOwner", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const publicAddress = req.body.publicAddress;
  const privateAddress = req.body.privateAddress;

  //execute query
  con.query(
    "INSERT INTO slot_ownsers VALUES (?, ?, ?, ?) ",
    [email, password, publicAddress, privateAddress],
    (err, result) => {
      if (err) {
        res.send(JSON.stringify({ success: false }));
      } else {
        //If query executes successfully, then return true in response, else false
        res.send(
          JSON.stringify({
            success: true,
          })
        );
      }
    }
  );
});

//endpoint for making transaction
app.post("/api/sendTransaction", (req, res) => {
  const senderPublicKey = req.body.senderPublicKey;
  const senderPrivateKey = req.body.senderPrivateKey;
  const receiverPublicKey = req.body.receiverPublicKey;
  const amount = req.body.amount;

  console.log("Sender PK: ", senderPublicKey);
  console.log("Sender PV: ", senderPrivateKey);
  console.log("Receiver PK: ", receiverPublicKey);

  //Signing Transaction
  const privateKey = Buffer.from(
    senderPrivateKey.substring(2, senderPrivateKey),
    "hex"
  );

  //get nonce and create transaction object
  web3.eth.getTransactionCount(senderPublicKey, (error, count) => {
    const txObject = {
      nonce: web3.utils.toHex(count),
      to: receiverPublicKey,
      value: web3.utils.toHex(web3.utils.toWei(amount, "ether")),
      gasLimit: web3.utils.toHex(21000),
      gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
    };

    const transaction = new Tx(txObject, { chain: "ropsten" });
    transaction.sign(privateKey);
    const serializedTransaction = transaction.serialize();
    const raw = "0x" + serializedTransaction.toString("hex");

    // console.log(raw)
    //Broadcast the transaction
    web3.eth.sendSignedTransaction(raw, (error, transactionHash) => {
      if (error) {
        console.log("\n\n" + error);
        res.send("Error Occured");
      } else {
        console.log("Updation tHash " + transactionHash);
        res.send(JSON.stringify({ transactionHash: transactionHash }));
      }
    });
  });
});

app.post("/api/updateVacancy", (req, res) => {
  const senderPublicKey = req.body.senderPublicKey;
  const senderPrivateKey = req.body.senderPrivateKey;
  const lotId = req.body.lotId;

  console.log("For vacancy, Sender PK: ", senderPublicKey);
  console.log("For vacancy, Sender PV: ", senderPrivateKey);
  console.log("For vacancy, Lot Id: ", lotId);

  //Signing Transaction
  const privateKey = Buffer.from(
    senderPrivateKey.substring(2, senderPrivateKey),
    "hex"
  );
  //Update vacancy for this lot, make another transaction indeed

  const contract = new web3.eth.Contract(ParkingABI, CONTRACT_ADDRESS);

  web3.eth.getTransactionCount(senderPublicKey, (error, transactionCount) => {
    const data = contract.methods.setLotVacancy(lotId).encodeABI();

    const txObject = {
      nonce: web3.utils.toHex(transactionCount + 1),
      to: CONTRACT_ADDRESS,
      gasLimit: web3.utils.toHex(1000000),
      gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
      data: data,
    };

    const transaction = new Tx(txObject, { chain: "ropsten" });
    transaction.sign(privateKey);
    const serializedTransaction = transaction.serialize();
    const raw = "0x" + serializedTransaction.toString("hex");

    web3.eth.sendSignedTransaction(raw, (error, transactionHash) => {
      if (error) {
        console.log("\n\n" + error);
        res.send("Error Occured While updating Lot vacancy");
      } else {
        console.log("Updation tHash " + transactionHash);
        res.send(JSON.stringify({ transactionHash: transactionHash }));
      }
    });
  });
});

//endpoint for adding new lot
app.post("/api/addParkingLot", (req, res) => {
  const ownerAddress = req.body.ownerAddress;
  const lotId = req.body.lotId;
  const price = req.body.price;
  const location = req.body.location;
  const description = req.body.description;
  const vacancy = req.body.vacancy;
  const ownerPrivateKey = req.body.privateKey;

  //Signing Transaction
  const privateKey = Buffer.from(
    ownerPrivateKey.substring(2, ownerPrivateKey),
    "hex"
  );

  //#region console messages
  console.log("Lot Owner Address: " + ownerAddress);
  console.log("LotId: " + lotId);
  console.log("Price: " + price);
  console.log("Location: " + location);
  console.log("Description: " + description);
  console.log("Vacancy: " + vacancy);
  console.log("Vacancy: " + ownerPrivateKey);

  //#endregion
  const contract = new web3.eth.Contract(ParkingABI, CONTRACT_ADDRESS);

  //get nonce and create transaction object
  web3.eth.getTransactionCount(ownerAddress, (error, count) => {
    //We pass contract method in our transaction
    const data = contract.methods
      .setParking(ownerAddress, lotId, price, location, description, vacancy)
      .encodeABI();

    const txObject = {
      nonce: web3.utils.toHex(count),
      to: CONTRACT_ADDRESS,
      gasLimit: web3.utils.toHex(1000000),
      gasPrice: web3.utils.toHex(web3.utils.toWei("10", "gwei")),
      data: data,
    };

    const transaction = new Tx(txObject, { chain: "ropsten" });
    transaction.sign(privateKey);
    const serializedTransaction = transaction.serialize();
    const raw = "0x" + serializedTransaction.toString("hex");

    // console.log(raw)
    //Broadcast the transaction
    web3.eth.sendSignedTransaction(raw, (error, transactionHash) => {
      if (error) {
        console.log("\n\n" + error);
        res.send("Error Occured");
      } else {
        console.log("Lot Added TransactionHash: " + transactionHash);
        res.send(JSON.stringify({ transactionHash: transactionHash }));
      }
    });
  });
});

//Get All parking lots of owner

//Run express server at defined PORT
app.listen(PORT, () => {
  console.log("Server has started at port " + PORT);
});

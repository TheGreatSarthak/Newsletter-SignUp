const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signUp.html");
});
app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  console.log(firstName,lastName,email);
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
      // {
      //   skipMergeValidation: true,
      // }
    ],
  };
  const jsonData = JSON.stringify(data);
  const url = process.env.ListID;
  const options = {
    method: "POST",
    auth: process.env.AuthID,
  };
  const requestMC = https.request(url, options, function (response) {
    
    if(response.statusCode===200){
      res.sendFile(__dirname + "/success.html");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  requestMC.write(jsonData);
  requestMC.end();
  
});
app.post("/success",function (req,res){
  res.redirect("/");
});
app.post("/failure",function (req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port 3000.");
});





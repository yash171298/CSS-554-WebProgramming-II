// const express = require('express');
// const bluebird = require('bluebird');
 const redis = require('redis');
// const client = redis.createClient();
// const configRoutes = require("./routes");
// const static = express.static(__dirname + '/public');
// const app = express();


const express = require('express');
const app = express();
const configRoutes = require('./routes');


app.use(express.json());
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});

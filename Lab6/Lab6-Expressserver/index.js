const express = require('express');
const redis = require("redis");
const client = redis.createClient();
const configRoutes = require('./routes');
const app = express();

async function connect(){
  return await client.connect();
}
connect();

app.use(express.json());
app.use(express.urlencoded( {extended: true} ));

app.use('/pokemon/page/:id', async (req, res, next) => {
   
    let pageExist = await client.exists("pg".concat(req.params.id));
  if(pageExist)
  {
      let data = await client.get("pg".concat(req.params.id));
      res.json(JSON.parse(data));
  }
    next();
  });

app.use('/pokemon/:id', async (req,res,next)=> {

let pokemonExist = await client.exists("poke".concat(req.params.id));
if(pokemonExist)
{
    let data = await client.get("poke".concat(req.params.id));
    res.json(JSON.parse(data));
}
next();
});



configRoutes(app);

app.listen(3001, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3001');
});

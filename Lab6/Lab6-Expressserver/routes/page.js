const express = require('express');
const router = express.Router();
const data = require('../data');
let pokemon = data.pokemon;
const redis = require('redis');
let client = redis.createClient();

async function connect(){
    return await client.connect();
  }
  connect();

router.get('/:id', async (req, res) => {
    try{
    if(!req.params.id) throw "Id not found."
    if(req.params.id%1!=0) throw "Id not in correct format."
   
    let pageData = 0;
    pageData = await pokemon.getbypage(req.params.id);
    console.log(req.params.id)
    pageExist = await client.HEXISTS("page", req.params.id);
    console.log(pageExist)
    if(pageExist == false){
        
        await client.HSET("page", req.params.id, JSON.stringify(pageData));
        console.log("hey")
        res.json(pageData)
        
    }
    else{
        pageData = await client.HGET("page", req.params.id)
        pageData = JSON.parse(pageData)
        console.log(pageData)
        res.json(pageData)
        
    }
    }
    catch(e){
        res.json("Cannot find particular data.")
        res.status(404);
        
    }
});

module.exports = router;
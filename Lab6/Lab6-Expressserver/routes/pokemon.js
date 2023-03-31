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
       
        let pokemonData = 0;
        pokemonData = await pokemon.getPokemonById(req.params.id);
        id = pokemonData.data.id
        console.log(id)
        pokeExist = await client.HEXISTS("pokemon", id);
        console.log(pokeExist)
        if(pokeExist == false){
            
            await client.HSET("pokemon", id, JSON.stringify(pokemonData));
            console.log("hey")
            res.json(pokemonData)
            
        }
        else{
            pokemonData = await client.HGET("pokemon", id)
            pokemonData = JSON.parse(pokemonData)
            console.log(pokemonData)
            res.json(pokemonData)
            
        }
        }
        catch(e){
            res.json("Cannot find particular data.")
            res.status(404);
            
        }
      });


module.exports = router;
const bluebird = require('bluebird');
const express = require('express');
const router = express.Router();
const flat  = require("flat")
const unflatten = flat.unflatten
const app = express();
const redis = require('redis');
const client = redis.createClient()
const data = require("../data")
const user = data.users;

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get('/history', async (req, res) => {
    try {
        let peopleVisited = (await client.lrangeAsync('PeopleVisited',0,19)).map(JSON.parse);
        if(peopleVisited.length === 0) throw "No user has visited yet"
        res.json(peopleVisited);
    }
    catch (e) {
       
        res.status(404).json({ error: 'No user has visited the webpage yet' });
      }
});

router.get('/:id', async (req, res) => {
    try {
        
        doesPgIdExist = await client.existsAsync(req.params.id);
        let newData = await client.hgetallAsync(req.params.id);
         if(doesPgIdExist === 1){
            newData.id = parseInt(newData.id);
            await client.lpush('PeopleVisited', JSON.stringify(newData));
            res.json(newData);
        
  
      }
      else {
          let id = req.params.id;
        const peopleData = await user.exportedmethods.getById(id);
        console.log(peopleData);
        const x = await client.hmsetAsync(id, peopleData);
        let tempData = await client.hgetallAsync(id);
        console.log(tempData.id);
        tempData.id = parseInt(tempData.id);
  
        await client.lpush('PeopleVisited', JSON.stringify(tempData));
  
        res.json(tempData);
      }
    } catch (e) {
      res.status(404).json({ error: 'id not found' });
    }
  });

module.exports = router;
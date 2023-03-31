const pageRoutes = require('./page');
const pokeRoutes = require('./pokemon');

const redis = require("redis");
let client = redis.createClient()


const constructorMethod = (app) => {

  app.use('/pokemon/page', pageRoutes);
  
  app.use('/pokemon', pokeRoutes);
    
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Page Not Found : 404 Error' });
  });
};

module.exports = constructorMethod;
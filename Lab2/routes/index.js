const serverRoutes = require('./server')

const constructorMethod = (app) => {

  app.use('/api/people', serverRoutes);
    
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;
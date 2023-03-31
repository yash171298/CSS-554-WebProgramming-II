const blogRoutes = require('./blog');

const constructorMethod = (app) => {
 
    app.use('/', blogRoutes);
   // app.use('/admin', adminRoutes);
  
    app.use('*', (req, res) => {
      res.sendStatus(404);
    });
  };
  
  
  module.exports = constructorMethod;
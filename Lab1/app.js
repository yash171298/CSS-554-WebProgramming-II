const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
app.use(cookieParser());

const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');

app.use(express.json());
// Middlewares:

/* 
req is the request object, just like how we have access to the request in our routes
 res is the response object, just like how we have access to the response in our routes
 next is a callback that will call the next middleware registered, or proceed to routes if none exist.
 If we do not call next(), we need to make sure we send a response of some sort or it will poll forever!
*/

// 1. One which will count the number of requests made to your website
let totalRequests = 0;
app.use(
  session({
    name: 'AuthCookie',
    secret: "Leo messi is best footballer",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 660000 }
    
  })
);
app.use('/', async (req,res,next)=>{
    let user_status;
    if(req.session.user)
    user_status="User is logged in";
    else
    user_status="User is not logged in";

    console.log(user_status);
    next();
  });

app.post('/blog', (req, res, next) => {
  console.log(req.session.id);
  if (!req.session.user) {
    return res.status(403).json({ error: "User is not logged in You must login"});
  } else {
    next();
  }
});

app.put('/:id', (req, res, next) => {
    console.log(req.session.id);
    if (!req.session.user) {
      return res.status(403).json({ error: "User is not logged in You must login"});
    } else {
      next();
    }
  });

  app.patch('/:id', async (req,res,next)=>{
    //console.log(req.session.id);
    if(!req.session.user)
    return res.status(403).json({"error": "User not logged in"});
    else
    next();
  });

  app.post('/blog/:id/comments', async (req,res,next)=>{
    //console.log(req.session.id);
    if(!req.session.user)
    return res.status(403).json({"error": "User not logged in"});
    else
    next();
  });

  app.delete('/:blogId/:commentId', async (req,res,next)=>{
    //console.log(req.session.id);
    if(!req.session.user)
    return res.status(403).json({"error": "User not logged in"});
    else
    next();
  });

  configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
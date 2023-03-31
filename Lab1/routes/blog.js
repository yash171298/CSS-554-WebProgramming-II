const blogData = require('../data/blog')
const userData = require('../data/user')
const commentData = require('../data/comment')
const express = require('express');
const router = express.Router();
const querystring = require('querystring');

router.get('/?', async (req, res) => {
    
    
    let skip = 0;
    if(req.query.skip){
        skip = req.query.skip;
    }
    
    let take = 20;
    if(req.query.take>100){
        take = 100;
    }
    if(req.query.take){
        take = req.query.take;
    }
    try {
      const blogList = await blogData.getAllblogs(parseInt(skip),parseInt(take));
      res.status(500).json(blogList);
    } catch (e) {
      res.status(500).json({ error: e });
    }
});

router.get('/:id', async (req, res) => {
    try {
      
      let blog = await blogData.get(req.params.id);
      res.status(200).json(blog);
    } catch (e) {
      res.status(404).json({ error: 'Blog not found' });
    }
  });

  router.post('/blog', async (req, res) => {
    const blogData2 = req.body;
    
    console.log(blogData2)
    try {
      if(!req.body.title || !req.body.body){
          throw "You need to provide all the inputs"
      }
      blogData2.userThatPosted = {id: req.session.user.id, username: req.session.user.username };
      const {title, body, userThatPosted } = blogData2;
      const newBlog = await blogData.createBlog (title, body, userThatPosted);
      res.status(200).json(newBlog);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  });

  router.put('/blog/:id', async (req, res) => {
    let blogInfo = req.body;
    console.log(blogInfo)
    if (!blogInfo || !req.body.title || !req.body.body) {
      res.status(400).json({ error: 'You must provide data to update a blog' });
      return;
    }

    try {
        let temp = await blogData.get(req.params.id);
        if(!temp) throw "blog not found"
        console.log( req.session.user.id)
        console.log(temp.userThatPosted.id)
        if( req.session.user.id != temp.userThatPosted.id && req.session.user.username != temp.userThatPosted.username) 
        {
            throw "Sorry you are not allowed to perform this action"
        }
        
      } catch (e) {
        res.status(404).json({ error: e });
        return;
      }
      try {
        const updatedblog = await blogData.updateblog(req.params.id, blogInfo);
        res.status(200).json(updatedblog);
      } catch (e) {
        res.status(400).json({error: e});
      }
});

router.patch('/blog/:id', async (req, res) => {
    const requestBody = req.body;
    
    let updatedObject = {};
    updatedObject = updatedObject = await blogData.get(req.params.id);
    console.log(updatedObject)
    try {
      const oldPost = await blogData.get(req.params.id);
      if( req.session.user.id != oldPost.userThatPosted.id && req.session.user.username != oldPost.userThatPosted.username) 
        {
            throw "Sorry you are not allowed to perform this action"
        }
      if (requestBody.title && requestBody.title !== oldPost.title){
                 updatedObject.title = requestBody.title;
      }
       if (requestBody.body && requestBody.body !== oldPost.body){
        updatedObject.body = requestBody.body;
       }
       
    } catch (e) {
      res.status(404).json({ error: e+"Provided inputs are incorrect" });
      return;
    }
    if (Object.keys(requestBody).length !== 0) {
      try {
        const updatedblog = await blogData.updateblog(
          req.params.id,
          updatedObject
        );
        console.log(updatedblog)
        res.status(200).json(updatedblog);
      } catch (e) {
        res.status(404).json({ error: e });
      }
    } else {
      res.status(404).json({
        error:
          'No fields have been changed from their inital values, so no update has occurred'
      });
    }
  });

  router.post('/:id/comments', async (req, res) => {
    const blogReviewData = req.body;
    let id = 0;


    try {
        if(!req.params.id) throw "You should provide an id to enter comment"
        if(!req.body.comment) throw "You should provide appropriate comment"
        blogReviewData.userThatPostedComment = {id: req.session.user.id, username: req.session.user.username };
        console.log(blogReviewData)
        const { userThatPostedComment, comment } = blogReviewData;
        const newPost = await commentData.createComment(req.params.id, userThatPostedComment, comment);
  
        res.status(200).json(await blogData.get(req.params.id));
      } catch (e) {
        res.status(400).json({ error: e });
      }
    });

    router.delete('/:blogId/:commentId', async (req, res) => {
        try {
            if(!req.params.blogId) throw " Please provide id to remove"
            if(!req.params.commentId) throw " Please provide id to remove"
            await commentData.get(req.params.commentId);
          } catch (e) {
            res.status(404).json({error: e});
            return;
          }
          try {
            const deletePost = await commentData.removeComment(req.params.blogId,req.params.commentId);
            res.status(200).json(deletePost);
          } catch (e) {
            res.status(404).json({error: e});
          }
        });
    
    router.post('/blog/signup', async (req, res) => {
        try{
            if(!req.body.name) throw "please provide credentials"
            if(!req.body.username) throw "please provide credentials"
            if(!req.body.password) throw "please provide credentials"
            let name = req.body.name;
            let username = req.body.username;
            let password = req.body.password;
        const newUser = await userData.adduser(name, username, password);
        if(newUser == null){
            flag = true
        
        }
        if(!newUser){
            flag = true;
        }
        res.status(200).json(newUser);
      
      } catch (e) {
        res.json( {errors : "No inputs provided" });
        res.status(400);
      }
   });

   router.post("/blog/login", async (req, res) => {

    try{    
        if(!req.body.username) throw "please provide credentials"
        if(!req.body.password) throw "please provide credentials"
        let username = req.body.username;
        let password= req.body.password;
        
        
        authenticatedUser=  await userData.userauthentication(username,password);
        console.log(authenticatedUser)
        req.session.user={username: authenticatedUser.username, id: authenticatedUser._id};
        console.log(req.session.user);
        res.status(200).json({authenticatedUser});

    }catch(e){
        let error = e.toString();
        res.status(401).json({ error: error });
    }
});

router.get('/blog/logout', async (req, res) => {
    req.session.destroy(function() {
        res.clearCookie('AuthCookie');
        return res.json({done :"Logged out successfully"});
      });
})

module.exports = router;
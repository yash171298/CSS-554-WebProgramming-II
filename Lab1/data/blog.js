const mongoCollections = require('../config/mongoCollections');
const mongocall = require("mongodb");
const blogs = mongoCollections.blogs;

module.exports = {
    async createBlog(title, body, userThatPosted){
            const blogCollection = await blogs();
            if(!title) throw "Input for this field is required"
            if(!body) throw "Input for this field is required"
            if(!userThatPosted) throw "Input for this field is required"

            if(typeof title != 'string') throw 'No inputs provided or the runtime is not a string';
            if(typeof body != 'string') throw 'No inputs provided or the runtime is not a string';
            if(typeof userThatPosted != 'object') throw 'No inputs provided or the runtime is not a string';

            let newblog = {
                title: title,
                body: body,
                userThatPosted: userThatPosted,
                comments: []
            }

            const insertInfo = await blogCollection.insertOne(newblog);
        if (insertInfo.insertedCount === 0) throw 'Could not add blog';
    
        const newId = insertInfo.insertedId;
    
        const blog = await this.get(newId.toString());
        return blog;
    },

    async get(id) {
        if (!id) throw "You must provide an id to search for";
        if (typeof id != 'string') throw 'Id is not a String.';
        
        const blogCollection = await blogs();
        const result = await blogCollection.findOne({ _id: mongocall.ObjectId(id) }); 
        if (result === null) throw `No blog with that id : ${id}`;
        result._id = result._id.toString();
    
        return result;
    },

    getAllblogs: async (skip, take) => {
        const blogCollection = await blogs();
        
        const blogList = await blogCollection.find({}).skip(skip).limit(take).toArray();
        return blogList;
      },

      async updateblog(id, updatedblog) {
        if (!id) throw "You must provide an id to search for";
        if (!updatedblog) throw "You must provide proper updating data";
        if(!updatedblog.title || typeof updatedblog.title != 'string') throw " not a proper title";
        if(!updatedblog.body || typeof updatedblog.body != 'string') throw " not a proper title";
       console.log("reached")

        const blog = await this.get(id);
      console.log(blog);
  
      let blogUpdateInfo = {
        title: updatedblog.title,
        body: updatedblog.body,
        }
        const blogCollection = await blogs();
        const updateInfo = await blogCollection.updateOne(
          { _id: mongocall.ObjectId(id) },
          { $set: blogUpdateInfo }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
          throw 'Update failed';
    
        return await this.get(id);

      }

}

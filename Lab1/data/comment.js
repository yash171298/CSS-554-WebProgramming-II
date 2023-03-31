const mongoCollections = require('../config/mongoCollections');
const blogcollection = mongoCollections.blogs;
const {ObjectID, ObjectId}=require("mongodb")
const blog = require('./blog');

module.exports = {
    async createComment(blogId, userThatPostedComment, comment){
        const blogData= await blogcollection();
        console.log(blogId);
        let newComment = {
            _id: ObjectId(),
            userThatPostedComment: userThatPostedComment,
            comment: comment
        }
        const newInsertInformation = await blogData.updateOne({_id:ObjectId(blogId)},{$addToSet:{comments:newComment}});
        return await this.get(blogId);
    },
    async removeComment(blogId, id){
        if (!id) throw "You must provide an id to search for"
        if (typeof id != 'string') throw 'Id is not a String.';
        
        const blogCollection = await blogcollection();
        const result = await blogCollection.findOne({ "comments._id": ObjectId(id)}); 
        console.log("reached")
        if (result === null) throw `No comments with that id : ${id}`;
        let x = 0;
        x = blogId;
        const deletereview = await this.get(id)
        const updateInfo = await blogCollection.updateOne({ _id: ObjectId.ObjectID(x) },{ $pull: { comments: { _id : ObjectId(id) } } });
        
        
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
          throw 'Update failed';
          //return '{"reviewId": ' + id.toString() +"," +'"deleted": ' +true +'}'  + '.' ;
          return {'comments': id.toString(), "deleted" : true}
      
        },
    async get(id) {
        
        if (!id) throw "You must provide an id to search for"
        if (typeof id != 'string') throw 'Id is not a String.';
        
        const blogCollection = await blogcollection();
        
        const result = await blogCollection.findOne({ "comments._id": ObjectId(id)}); 
        if (result === null) {
            return "Comment added succesfully"
        };
        //result._id = result._id.toString();
        //const filter = await result.findOne({"reviews._id": ObjectID(id)});
        for(let i=0; i< (result.comments).length; i++){
          if(result.comments[i]._id.toString() == id){  filter = result.comments[i]}
        }
        if (filter === null) throw "No movies with that id";
        
        return filter;
    }

}
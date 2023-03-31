const mongoCollections = require('../config/mongoCollections');
const bcrypt = require("bcryptjs");
const bcrypt2 = require('bcrypt');
const saltNumber = 16;
const mongocall = require("mongodb");
const users = mongoCollections.users;

module.exports = {
    async adduser(name, username, password){
        const userCollection = await users();

        if(!name) throw "Please Provide a valid Input"
        if(!username) throw "Please Provide a valid username"
        if(!password) throw "Please provide a password"

        if(typeof name != 'string' && typeof username != 'string') throw "Incorrect input provided"

        const hashedPassword = await bcrypt.hash(password, saltNumber);

        let newuser = {
            name: name,
            username: username,
            password: hashedPassword
        }

        const insertInfo = await userCollection.insertOne(newuser);
        if (insertInfo.insertedCount === 0) throw 'Could not add user';
    
        const newId = insertInfo.insertedId;
    
        const user = await this.get(newId.toString());
        return user;
    },

    async get(id) {
        if (!id) throw "You must provide an id to search for"
        //if (typeof id != 'string') throw 'Id is not a String.';
        
        const userCollection = await users();
        const result = await userCollection.findOne({ _id: mongocall.ObjectId(id) }); 
        if (result === null) throw `No user with that id : ${id}`;
        result._id = result._id.toString();
        return result;
    },

    async userauthentication(username, password){
        if(!username && !password) throw " Please Provide Inputs"
        if(typeof username != 'string') throw "Incorrect inputs provided"
        const userCollection = await users();
        console.log(password)
        const finduser = await userCollection.findOne({ username: username });
        console.log(finduser)
        if(finduser == null) throw "Not found in database"
        let userFound = await bcrypt2.compare(password, finduser.password);
        if(!finduser) throw "No user with tha username please provide valid username";
        if(!userFound) throw "Please enter a valid password or the credentials provided do not match"
        console.log("yay authenticated")
        return await this.get(finduser._id);

    }
}
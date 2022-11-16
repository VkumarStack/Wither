const User = require("../models/usersmod");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const { db } = require("../models/usersmod");

const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient("mongodb+srv://CS35L:d4aoCo7ZFcnkvcG1@cluster0.avwb5ku.mongodb.net/?retryWrites=true&w=majority");

exports.getUsers = async function getUsers(req, res) {
  try{
    const database = client.db("test");
    users = database.collection("users");
    const cursor = users.find();

    if(await cursor.count() === 0){
      console.log("No users found");
    }

    const data = await users.find({}).toArray();

    await cursor.forEach(console.dir);
    res.json(data);
  }
  catch{
    await console.log("error in finding users");
  }

}

exports.idFromUsername = async function idFromUsername(req, res){
  try{
    const database = client.db("test");
    users = database.collection("users");

    const field = "_id";
    const query = {a_username: req.body.username.toLowerCase()};

    const id = await users.distinct(field, query);

    res.json(id);
  }
  catch{
    await console.log("User not found");
    res.json("User not found")
  }
}

  exports.userExists = async function userExists(req, res){
    try{
      const database = client.db("test");
      users = database.collection("users");
  
      const query = {a_username: req.body.username.toLowerCase()};
  
      const user = await users.findOne(query);

      if(user === null)
    {
      res.json({Error: "User doesn't exist"});
      return;
    }

      console.log(user);
      res.json(user);
      return true;
    }
    catch{
      await console.log("User not found");
      res.json("User not found")
      return false;
    }
  }

  exports.getUserID = async function getUserID(req, res){
    try{
      const database = client.db("test");
      users = database.collection("users");
  
      const query = {a_username: req.body.username.toLowerCase()};
  
      const user = await users.findOne(query, {projection:{a_password: 0}});
      console.log(user);
      res.json(user);
      return true;
    }
    catch{
      await console.log("User not found");
      res.json("User not found")
      return false;
    }
  }
const Authentication = require("../controllers/authenticationController");

exports.getUsers = async (req, res) => {
  try{
    const response = await User.find({}).select("a_username -_id");
    let test = [];
    response.forEach(element => test.push(element.a_username));
    res.send({users: test});
  }
  catch {
    res.send({Error: "Could not fetch all users"});
  }
};
  

// Split this so that one function checks if the user already exists 
// and the next adds them to the database
exports.createUser = async function createUser(req, res) {
  userdetails = {
    a_username: req.body.username.toLowerCase(), 
    a_password: req.body.password, 
    a_bio: "Create a Bio",
    a_posts: [],
    a_followers: []
  }
  var user = new User(userdetails);
  try {
    let otherUser = await User.findOne({a_username: req.body.username.toLowerCase()}).exec();
    if (otherUser !== null) {
      res.json({Error: "User already exists"})
      return;
    }
    else {
      await user.save();
      const token = Authentication.createToken(req.body.username);
      res.json({a_username: userdetails.a_username, 
                a_bio: userdetails.a_bio,
                a_posts: userdetails.a_posts, 
                a_followers: userdetails.a_followers,
                token: token});
      return;
    }
  } catch {
    res.json({Error: "Something went wrong with the Database"});
  }
}

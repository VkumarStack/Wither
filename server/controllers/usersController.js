const User = require("../models/usersmod");
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
  
exports.getUserID = async (req, res) => {
  try {
    const resp = await User.findOne({a_username: req.params.userID}).select("-a_password");
    if(resp === null)
    {
      res.json({Error: "User doesn't exist"});
      return;
    }
    res.json({ user: resp});
  }
  catch {
    res.send({Error: "Could not fetch specific user"});
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

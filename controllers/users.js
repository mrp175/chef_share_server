const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { validateToken, invalidateToken } = require('../middlewares/tokenValidation');
const SECRET_KEY = process.env.SECRET_KEY


const createUser = async (req, res) => {
  try {
    const {email, password, username} = req.body;

    if (!(email && password && username))  {
      return res.status(400).send('invalid request');
    }
    if(await User.findOne({email}).exec()) {
      return res.status(400).send('user already exists!');
    }

    // create user
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const newUser = await new User({email, password: hashedPassword, username});
    newUser.save();
    // send back access token
    let token = jwt.sign({_id: newUser._id}, SECRET_KEY, {expiresIn: '1h'});
    validateToken(token);
    res.status(200).json({accessToken: token});

  } catch (e) {
    console.log(e)
    res.status(403).send(e);
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).end('username and password are required');
  }
  let user = await User.findOne({email}).exec();
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(403).end('invalid username or password');
  }

  // send back access token
  let token = jwt.sign({_id: user._id}, SECRET_KEY, {expiresIn: '1h'});
  validateToken(token);
  res.status(200).json({accessToken: token});
}


const profile = async (req, res) => {

  const user = await User.findById(req.body._id);
  if(user) {
    res.status(200).json(user);
  } else {
    res.sendStatus(400);
  }
}

const logout = async (req, res) => {
   token = req.headers['authorization'].split(' ')[1];
   invalidateToken(token);
   res.status(200).send('logout successful');
}


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (e) {
    console.log(e)
    res.status(400).send(e);
  }
}

module.exports = { createUser, getAllUsers, login, logout, profile};
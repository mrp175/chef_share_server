import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import {UserSchema} from '../types'
import {Request, Response} from 'express'

import User from '../models/user'
import { validateToken, invalidateToken } from '../middlewares/tokenValidation';
const SECRET_KEY = process.env.SECRET_KEY as string


const createUser = async (req:Request, res:Response):Promise<void> => {
  try {
    const {email, password, username} = req.body;

    if (!(email && password && username))  {
       res.status(400).send('invalid request');return
    }
    if (await User.findOne({email}).exec()) {
       res.status(403).send('user already exists!');return
    }
    if (await User.findOne({username}).exec()) {
       res.status(409).send('this username is taken');return
    }

    // create user
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const newUser = await new User({email, password: hashedPassword, username});
    newUser.save();
    // send back access token
    let token:string = jwt.sign({_id: newUser._id}, SECRET_KEY, {expiresIn: '3h'});
    validateToken(token);
    res.status(201).json({accessToken: token});

  } catch (e) {
    console.log(e)
    res.status(403).send(e);
  }
}

const login = async (req:Request, res:Response):Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).end('username and password are required');
  }
  let user = await User.findOne({email}).exec();
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(403).end('invalid username or password');
  }

  let token = req.headers['authorization']?.split(' ')[1];
  if (token) {
    token = jwt.sign({_id: user._id}, SECRET_KEY, {expiresIn: '3h'});
  }
  // send back access token
  validateToken(token);
  res.status(200).json({accessToken: token});
}


const profile = async (req:Request, res:Response):Promise<void> => {
  const user = await User.findById(req.body._id);
  if(user) {
    res.status(200).json(user);
  } else {
    res.sendStatus(400);
  }
}

const logout = async (req:Request, res:Response):Promise<void> => {
   const token = req.headers['authorization']?.split(' ')[1];
   invalidateToken(token);
   res.status(200).send('logout successful');
}


const getAllButMe = async (req:Request, res:Response):Promise<void> => {
  try {
    const users:UserSchema[] = await User.find();
    const allButMe = users.filter(user => user.id !== req.body._id);
    const usernames = allButMe.map(user => user.username);
    res.status(200).json(usernames);
  } catch (e) {
    console.log(e)
    res.status(400).send(e);
  }
}

const getFriendStore = async (req:Request, res:Response):Promise<void> => {
  try {
    const user = await User.findOne({username: req.body.username});
    if (user) {
      res.status(200).json(user.recipeStore);
    } else {
      throw new Error ('user not found');
    }
  } catch (e) {
    res.status(400).send(e);
  }

}


module.exports = { createUser, getAllButMe, login, logout, profile, getFriendStore };

require('dotenv').config();
const {mockUser} = require('./mocks');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../models/user');
const server = require('../../index.js');
const request = require('supertest');
const SECRET_KEY = process.env.SECRET_KEY;
console.log(SECRET_KEY);
let {storage} = require('../../middlewares/tokenValidation');

describe('login should work correctly - endpoint "/login"', function () {
  beforeEach(async () => {
    try {
      const {email, username, password} = mockUser.jeff;
      const saltRounds = 2;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      let user = new User({email, username, password: hashedPassword});
      await user.save();
    } catch (error) {
      console.error(error);
    }
  });
  afterEach(async () => {
    try {
      await mongoose.connection.dropCollection('users');
      storage = [];
    } catch (error) {
      return true;
    }
  });
  it('should return an error if the password is missing', async function () {
    const response = await request(server)
    .post('/login')
    .send({email: 'jeff@gmail.com'});
    expect(response.statusCode).toBe(400);
  });
  it('should return an error if the email is missing', async function () {
    const response = await request(server)
    .post('/login')
    .send({password: 'test'});
    expect(response.statusCode).toBe(400);
  });
  it('should respond with 200 status code when provided correct credentials', async function () {
    const response = await request(server)
    .post('/login')
    .send(mockUser.jeffLogin);
    expect(response.statusCode).toBe(200);
  });
  it('should respond with 403 status code when provided incorrect credentials', async function () {
    const response = await request(server)
    .post('/login')
    .send({...mockUser.jeffLogin, password: 'test1'});
    expect(response.statusCode).toBe(403);
  });
  it('should return a valid access token when provided correct credentials', async function () {
    const retrieveUser = await User.findOne({email: mockUser.jeff.email});
    const token = jwt.sign({_id: retrieveUser._id}, SECRET_KEY, {expiresIn: '3h'});
    const response = await request(server)
    .post('/login')
    .send({...mockUser.jeffLogin, password: 'test'});
    expect(response.body).toStrictEqual({accessToken: token});
  });
});

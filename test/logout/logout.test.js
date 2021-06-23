require('dotenv').config();
const jwt = require('jsonwebtoken');
const server = require('../../index.js');
const request = require('supertest');
const SECRET_KEY = process.env.SECRET_KEY;
console.log(SECRET_KEY);
const token = jwt.sign({_id: '60cdb63d7701481e3450fc8'}, SECRET_KEY, {expiresIn: '3h'});
const Token = require('../../models/token');

describe('logout should work correctly - endpoint "/logout"', function () { 
  beforeEach(async function () {
    const newToken = await new Token({token});
    await newToken.save();
  });
  afterEach(async function () {
    await Token.collection.drop();
  });
  it('should respond with 200 status code after successfully logging out', async function () {
    const response = await request(server)
    .get('/logout')
    .set('Authorization', `Bearer: ${token}`);
    expect(response.statusCode).toBe(200);
  });
  it('response text should be "logout successful" after successfully logging out', async function () {
    const response = await request(server)
    .get('/logout')
    .set('Authorization', `Bearer: ${token}`);
    expect(response.text).toBe('logout successful');
  });
  it('should remove the token from the database after successfully logging out', async function () {
    await request(server)
    .get('/logout')
    .set('Authorization', `Bearer ${token}`);
    const checkToken = await Token.findOne({token});
    expect(checkToken).toBeFalsy();
  });
  it('should respond with a 401 status code if the user is not logged in', async function () {
    const response = await request(server)
    .get('/logout')
    .set('Authorization', `Bearer: null`);
    expect(response.statusCode).toBe(401);
  });
  it('response text should be "You need to be logged in first" if the user is not logged in', async function () {
    const response = await request(server)
    .get('/logout')
    .set('Authorization', `Bearer: null`);
    expect(response.text).toBe('You need to be logged in first');
  });
});

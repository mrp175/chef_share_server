require('dotenv').config();
const { PORT } = process.env;
const router = require('../../router.js')
const supertest = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(express.json())
const jwt = require('jsonwebtoken');
const User = mongoose.connection.model('User');
const mockRecipe = require('./mockRecipe');
const mockData = require('../listingRecipes/mockData.json')
const SECRET_KEY = process.env.SECRET_KEY;
const token = jwt.sign({ _id: "60cdb5287701481e3450fc87" }, SECRET_KEY, { expiresIn: '3h' });
const Token = require('../../models/token');
const server = app.use(router).listen(PORT + 1);
const request = supertest(server)


describe('Adding recipes should work correctly', () => {
  beforeAll(async () => {
    const newToken = await new Token({token});
    await newToken.save();
    await User.insertMany(mockData);
  });
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    server.close();
  });
  it('should add a recipe when provided with a url from a supported website', (done) => {
    request
    .post('/scrape')
    .set('Authorization', `Bearer: ${token}`)
    .send({ 'url': 'https://sallysbakingaddiction.com/cherry-almond-buckle/' })
    .expect(200)
    .expect(res => {
      expect(res.body.image).toBe(mockRecipe.image);
    });
    done();
  })
  it('should reject an unsupported url', (done) => {
    request
    .post('/scrape')
    .set('Authorization', `Bearer: ${token}`)
    .send({ 'url': 'https://www.thisisnotavalidurl.com' })
    .expect(400)
    .expect(res => {
      expect(res.text).toMatch(/failed/gi)
    });
    done();
  });
});

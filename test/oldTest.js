require('dotenv').config();
const {PORT} = process.env;
//const {listingRecipesFromUser} = require('./listingRecipesFromUser.js');
const router = require ('../router.js')
const supertest = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const testingServer = app.use(router).listen (PORT+1);
const login = require('../tests/loginTest');

// const mockData = require('./mockData.json')

describe('Backend testing', () => {
  const request = supertest(testingServer)
  const User = mongoose.connection.model('User');
  //User.insertMany(mockData);
  afterEach(async () => {
    try {
      await mongoose.connection.dropCollection('users');
    } catch (error) {
      return true;
    }
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  describe('login should work correctly - endpoint "/login"', function () {
    login();
  });

//   describe('Listing recipes from user', (done)=>{
  
//   //listingRecipesFromUser (request, User, done)
//   login(request, User, done);

// });


});

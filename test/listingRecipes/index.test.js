require('dotenv').config();
const {PORT} = process.env;
const router = require ('../../router.js')
const supertest = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(express.json())
const testingServer = app.use(router).listen (PORT+1);
const jwt = require('jsonwebtoken');
const User = mongoose.connection.model('User');
const mockData = require('./mockData.json')
const request = supertest(testingServer)
const SECRET_KEY = process.env.SECRET_KEY;
const {storage} = require ('../../middlewares/tokenValidation.js')
const token = jwt.sign({_id: "60cdb63d7701481e3450fc89"}, SECRET_KEY, {expiresIn: '3h'});
storage.push(token)


describe('Listing recipes', () => {

  beforeAll(async ()=> {
   await User.insertMany(mockData);
  });


  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    testingServer.close()
    });

  describe('from current user', () => {
    it('No auth: It should require authorization',  (done) => {request.get('/profile').expect(403,done)});
        
    it('Auth: should return a status 200', (done) => {request.get('/profile').set('Authorization', `Bearer ${token}`).send().expect(200).expect("Content-Type", /json/).end(done);});
      
    it('Auth: should return the recipe "Pesto Pasta with V8® Healthy Greens"', (done) => {
       request.get('/profile').set('Authorization', `Bearer ${token}`).send().then (res=>{
       const result = res.body.recipeStore.find (recipe=>recipe.name==="Pesto Pasta with V8® Healthy Greens");
        expect(result).toBeDefined();
        done();
      }).catch(err => done(err));
     }
    )
  


     })
        





});



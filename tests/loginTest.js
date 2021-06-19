const mocks = require('./mocks');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
//const User = require('../models/user');

async function login (request, User, done) {
  
    beforeEach(async () => {
      try {
        const {email, userName, password} = mocks.jeff;
        const saltRounds = 2;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        let user = new User({email, userName, password: hashedPassword});
        await user.save();
      } catch (error) {
        console.error(error);
      }
    });
    afterEach(async () => {
      try {
        await mongoose.connection.dropCollection('users');
      } catch (error) {
        return true;
      }
    });
    it('should accept an email and password, and return the user object', async function () {
      request(jwt)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send(mocks.jeffLogin)
      .expect(200)
      .end(done);
    });
  
}

module.exports = login;

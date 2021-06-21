// require('dotenv').config();
// const express = require('express');
// const mocks = require('./mocks');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose');
// const User = require('../models/user');
// const server = require('../index.js');
// const request = require('supertest');
// const SECRET_KEY = process.env.SECRET_KEY;
// console.log(SECRET_KEY);
// server.use(express.json());
// let {storage} = require('../middlewares/tokenValidation');
// const token = jwt.sign({_id: 1234}, SECRET_KEY, {expiresIn: '3h'});


// describe('logout should work correctly - endpoint "/logout"', function () { 
//   beforeEach(function () {
//     storage = [token];
//   });
//   afterEach(function () {
//     storage = [];
//   });
//   it('should logout the user if they are logged in', async function () {
//     const response = await request(server)
//     .get('/logout')
//     .set('Authorization', `Bearer ${token}`);
//     expect(response.statusCode).toBe(200);
//   });
//   it('should return an error if they are not logged in', async function () {
//     const response = await request(server)
//     .get('/logout')
//     .set('Authorization', 'Bearer ')
//     expect(response.statusCode).toBe(401);
//   });
//   it('should logout the user if they are logged in', async function () {
//     storage.push(token);
//     const response = await request(server)
//     .get('/logout')
//     .set('Authorization', `Bearer ${token}`);
//     expect(response.body).toBe('logout successful');
//   });
//   it('should rremove the token from local storage', async function () {
//     const response = await request(server)
//     .get('/logout')
//     .set('Authorization', `Bearer ${token}`)
//     console.log(storage);
//     expect(storage.length).toBe(0);
//   });

// });

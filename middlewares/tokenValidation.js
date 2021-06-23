const Token = require('../models/token');

async function validateToken (token) {
  const oldToken = await Token.findOne({token});
  if (oldToken) await Token.findOneAndRemove({token});
  const newToken = await new Token({token});
  newToken.save();
}

async function invalidateToken (token) {
  await Token.findOneAndRemove({token});
}

async function isTokenValid (token) {
  const retrievedToken = await Token.findOne({token});
  if (retrievedToken) return true;
  else return false;
}

module.exports = {
  validateToken, isTokenValid, invalidateToken
};

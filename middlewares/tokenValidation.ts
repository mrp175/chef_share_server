import Token from '../models/token';

export async function validateToken (token:string|undefined):Promise<void> {
  const oldToken = await Token.findOne({token});
  if (oldToken) await Token.findOneAndRemove({token});
  const newToken = new Token({token});
  await newToken.save();
}

export async function invalidateToken (token:string|undefined):Promise<void>{
  await Token.findOneAndRemove({token});
}

export async function isTokenValid (token:string|undefined):Promise<boolean>{
  const retrievedToken = await Token.findOne({token});
  if (retrievedToken) return true;
  else return false;
}



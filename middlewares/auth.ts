import jwt from 'jsonwebtoken';
import { Request, Response,NextFunction} from 'express';
import { isTokenValid } from './tokenValidation';
const SECRET_KEY = process.env.SECRET_KEY as string;


const authMiddleware = async (req:Request, res:Response, next:NextFunction) => {
  try {

    // get token
    const authHeaders = req.headers['authorization'];
    if (!authHeaders) return res.sendStatus(403);
    const token = authHeaders.split(' ')[1];

    if (!isTokenValid(token)) {
      throw new Error('invalid token');
    }

    let tokenData:any = jwt.verify(token, SECRET_KEY);
    req.body._id = tokenData._id;

    next();

  } catch (e) {
    res.status(401).end('You need to be logged in first');
  }

}

module.exports = authMiddleware;

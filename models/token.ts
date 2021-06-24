import mongoose from './index';
import {TokenSchema} from '../types'


const tokenSchema = new mongoose.Schema<TokenSchema>({
  token: {
    type: String,
    required: true
  }
});

const Token=mongoose.model<TokenSchema>('Token', tokenSchema);
export default Token

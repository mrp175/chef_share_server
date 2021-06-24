import {UserSchema} from '../types'
import mongoose  from './index';


const userSchema = new mongoose.Schema<UserSchema> ({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  recipeStore: {
    type: Array,
    required: false,
    default: []
  }
});

const User = mongoose.model<UserSchema> ('User', userSchema);
export default User;
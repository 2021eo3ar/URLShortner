import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    googleId: {type : String, required: true, unique: true},
    name: {type : String, required: true},
    email: {type : String, required: true},
    refreshToken: String, // New field
  });

  const User = mongoose.models.User || mongoose.model('User', userSchema);

  export default User;
  
  
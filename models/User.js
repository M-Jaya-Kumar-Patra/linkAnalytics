import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String, // null for Google users
  provider: {
    type: String,
    enum: ["credentials", "google"],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);

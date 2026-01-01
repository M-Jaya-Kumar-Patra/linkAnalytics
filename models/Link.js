import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema({
  slug: {
    type: String,
    unique: true,
    required: true
  },
  targetUrl: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Link ||
  mongoose.model("Link", LinkSchema);

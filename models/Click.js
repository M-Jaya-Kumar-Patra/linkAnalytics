import mongoose from "mongoose";

const ClickSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true
  },
  visitorId: {
    type: String,
    required: true
  },
  device: {
    type: String,
    enum: ["mobile", "desktop"],
    required: true
  },
  referrer: {
    type: String,
    default: "direct"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Click ||
  mongoose.model("Click", ClickSchema);

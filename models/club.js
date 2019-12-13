const mongoose = require("mongoose");

// EMBEDDED MODELS

// Response Model is embedded into the Thread Model, the the Thread Model is embedded into the Club Schema

const responseSchema = new mongoose.Schema({
  text: { type: String },
  profileImageURL: { type: String },
  username: { type: String },
  likes: { type: Number },
  timestamp: { type: Date }
});

const threadSchema = new mongoose.Schema({
  title: { type: String },
  prompt: { type: String },
  thumbnailURL: { type: String },
  backdropURL: { type: String },
  responses: [responseSchema]
});

const clubSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  currentTopic: { type: String },
  currentMovieURL: { type: String },
  threads: [threadSchema],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

const Club = mongoose.model("Club", clubSchema);
const Thread = mongoose.model("Thread", threadSchema);
const Response = mongoose.model("Response", responseSchema);

module.exports = { Club, Thread, Response };

// module.exports = mongoose.model("Club", clubSchema);
// module.exports = mongoose.model("Thread", threadSchema);
// module.exports = mongoose.model("Response", responseSchema);

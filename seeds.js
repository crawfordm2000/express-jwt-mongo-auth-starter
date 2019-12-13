const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = require("./models/user");
const Club = require("./models/club").Club;
const Response = require("./models/club").Response;
const Thread = require("./models/club").Thread;

const mongoURI = "mongodb://localhost:27017/express-jwt-mongo-auth-starter";
mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("the connection with mongod is established");
  }
);

// RESPONSES

// const positiveResponse = new Response({
//   text: "I really liked the cinematography.",
//   profileImage:
//     "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png",
//   timestamp: new Date(),
//   likes: 7
// });

// const negativeResponse = new Response({
//   text: "This film sucked...",
//   profileImage:
//     "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png",
//   timestamp: new Date(),
//   likes: 0
// });

// positiveResponse.save((error, savedPositiveResponse) => {
//   if (error) {
//     return console.log(error);
//   } else {
//     console.log("response one saved successfully");
//   }
// });

// negativeResponse.save((error, savedNegativeResponse) => {
//   if (error) {
//     return console.log(error);
//   } else {
//     console.log("response two saved successfully");
//   }
// });

const positiveResponse = new Response({
  text: "I really liked the cinematography.",
  profileImage:
    "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png",
  timestamp: new Date(),
  likes: 7
});

const negativeResponse = new Response({
  text: "This film sucked...",
  profileImage:
    "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png",
  timestamp: new Date(),
  likes: 0
});

const reviewThread = new Thread({
  title: "Blade Runner",
  prompt: "How did this movie make you feel?",
  thumbnailURL:
    "https://www.filmonpaper.com/wp-content/uploads/2011/05/BladeRunner_onesheet_OddNSSVersion_USA_JohnAlvin-1-500x757@2x.jpg",
  backdropURL:
    "https://preview.redd.it/4ywbipnh4tf21.png?width=960&crop=smart&auto=webp&s=e18c3306841ef26217349a151f501e18d27defcc",
  timestamp: new Date(),
  responses: []
});

// reviewThread.responses.push(positiveResponse);

// reviewThread.save();
// console.log(reviewThread);

// negativeResponse.save((error, savedNegativeResponse) => {
//   if (error) {
//     return console.log(error);
//   } else {
//     console.log("response two saved successfully");
//   }
// });

// THREADS

// //push responses to thread
reviewThread.responses.push(positiveResponse);
reviewThread.responses.push(negativeResponse);

reviewThread.save((error, savedThread) => {
  if (error) {
    return console.log(error);
  } else {
    console.log("Thread One is ", savedThread);
  }
});

// CLUBS

const BladeRunnerClub = new Club({
  title: "Blade Runner Fan Club",
  currentTopic: "Blade Runner 2049",
  currentMovieURL: "https://images6.alphacoders.com/875/thumb-1920-875570.jpg",
  threads: [],
  members: []
});

const userOne = new User({
  firstName: "Gatlin",
  lastName: "Carrier",
  username: "GatlinC",
  password: "dog",
  clubs: []
});

// push threads to blade runner club
BladeRunnerClub.threads.push(reviewThread);
// push members to blade runner clubs
BladeRunnerClub.members.push(userOne);
//save the club with those associations
BladeRunnerClub.save((error, savedBladeRunnerClub) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Blade Runner CLub is ", savedBladeRunnerClub);
  }
});

userOne.clubs.push(BladeRunnerClub);

userOne.save((error, savedUser) => {
  if (error) {
    return console.log(error);
  } else {
    console.log("user one successfully saved");
  }
});

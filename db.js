// 1ST DRAFT DATA MODEL
const mongoose = require('mongoose');

// pets
// * each pet must have a related owner
// * has a level and xp (once xp hits max, level up)
const Pet = new mongoose.Schema({
  owner: {type: String, required: true},
  name: {type: String, required: true},
  level: {type: Number, min: 1, required: true},
  type: {type: String, required: true},
  xp: {type: Number, min: 0, max: 200, required: true}
});


// a type of pet food that can be bought from the pet shop
// * includes the quantity of this item
// * includes the xp, if given to the pet, pet gains xp of the food!
const PetFood = new mongoose.Schema({
  username: {type: String, required: true},
  name: {type: String, required: true},
  xp: {type: Number, required: true},
  cost: {type: Number, required: true},
  quantity: {type: Number, min: 0, required: true},
});

// users
// * users have a username and password
// * they also can have 1 or more Pets
// * they have a list of pet foods to feed pets to level up!
const User = new mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  wallet: {type: Number, required: true}
  // pets: [Pet],
  // inventory: [PetFood],
});

// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
  const fs = require('fs');
  const path = require('path');
  const fn = path.join(__dirname, 'config.json');
  const data = fs.readFileSync(fn);

  // our configuration file will be in json, so parse it and set the
  // conenction string appropriately!
  const conf = JSON.parse(data);
  dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
  dbconf = 'mongodb://localhost/neopets';
}

// register models
mongoose.model('User', User);
mongoose.model('Pet', Pet);
mongoose.model('PetFood', PetFood);

mongoose.connect(dbconf, {useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false});
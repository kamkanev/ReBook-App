const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name:{
		type: String,
		required: true
	},
  last_name: {
		type: String,
		required: true
	},
  username: {
		type: String,
		required: true,
    index: { unique: true }
	},
  image: {
		type: String,
		required: true,
		default: "../img/default-avatar.png"
  },
  email: {
		type: String,
		required: true,
    index: { unique: true }
	},
  password: {
		type: String,
	},
  friends:{
		type: Array,
		required: true
	},
  googleid: {
    type: String
  },
  facebookid:{
    type: String
  },
  twitterid:{
    type: String
  },
    school: {
        type: String
    }
});

const User = mongoose.model('user', userSchema);

module.exports = User;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classRoom = new Schema({

  name:{
    type: String,
    required: true,
    index: {unique: true}
  },
  timeOfCreation:{
    type: Number,
    required: true
  },
  description:{
    type: String,
    // required: true
  },
  icon:{
    type: String,
    default: "../img/favicon.png"
  },
  type:{
    type: String,
    required: true
  },
  password:{
    type: String
  },
  creator:{
    type: String,
    required: true
  },
  moderators:{
    type: Array,
    required: true
  },
  members:{
    type: Array,
    required: true
  },
  posts:{
    type: Array,
    required: true
  },
  chatrooms:{
    type: Array,
    required: true
  }


});

const ClassRoom = mongoose.model('classroom', classRoom);

module.exports = ClassRoom;

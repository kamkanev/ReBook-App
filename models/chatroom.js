const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatRoom = new Schema({

  name:{
    type: String,
    required: true
  },

  messages:{
    type: Array,
    default: []
  }

});

const ChatRoom = mongoose.model('chatroom', chatRoom);

module.exports = ChatRoom;

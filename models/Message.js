import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const messageSchema = new Schema({
  text: String,
  senderuserid: String,
  receiveruserid: String,
  senderId: String,
  senderName: String,
  senderImg: String,
  receiverId: String,
  receiverName: String,
  receiverImg: String,
  problemName: String,
  problemid : String,
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }


});

const Message = model('Message', messageSchema);

export default Message;

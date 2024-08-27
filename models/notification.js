import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const notificationSchema = new Schema({
    senderuserid: String,
receiveruserid: String,
    receiverId: String,
    senderId: String,
    senderName: String,
    senderImg: String,
    receiverName: String,
    receiverImg: String,
    problemName: String,
    problemid : String,
  message: String,
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});


const Notification = model('Notification', notificationSchema);

export default Notification;

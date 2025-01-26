import mongoose from 'mongoose';

const notificationContentSchema = new mongoose.Schema({
  subjectLine: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: false,
  },
});

export default notificationContentSchema;

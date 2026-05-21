import mongoose from 'mongoose';
import { IAttachment } from '../interfaces/IAttachment';

const attachmentSchema = new mongoose.Schema<IAttachment>({
  filename: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  type: {
    // Specifies the type of the attachment which can be 'photos' or 'documents' or 'videos'
    type: String,
    required: true,
  },
});

export default attachmentSchema;

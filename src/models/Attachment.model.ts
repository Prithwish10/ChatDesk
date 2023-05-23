import mongoose from "mongoose";
import { Attachment } from "../interfaces/Attachment";

const attachmentSchema = new mongoose.Schema<Attachment>({
  filename: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  type: { // Specifies the type of the attachment which can be 'photos' or 'documents' or 'videos'
    type: String,
    required: true,
  },
});

export default mongoose.model<Attachment>("Attachment", attachmentSchema);

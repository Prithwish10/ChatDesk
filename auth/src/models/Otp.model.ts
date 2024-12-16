import mongoose from 'mongoose';
import { OTPAttrs, OTPDoc, OTPModel } from '../interfaces/Otp';

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    hashedOtp: {
      type: String,
      required: true,
    },
    expiration: {
      type: Date,
      default: Date.now(),
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

otpSchema.statics.build = (attrs: OTPAttrs) => {
  return new Otp(attrs);
};

otpSchema.pre('updateOne', function (next) {
  this.updateOne({}, { $set: { updatedAt: new Date() } });
  next();
});

const Otp = mongoose.model<OTPDoc, OTPModel>('Otp', otpSchema);

export { Otp };

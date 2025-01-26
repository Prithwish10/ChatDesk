import mongoose from 'mongoose';
import { OTPAttrs, OTPDoc, OTPModel } from '../interfaces/Otp';
import { PasswordManager } from '../services/PasswordManager.service';
import { OTPContext } from '../enums/OTPContext';

const otpSchema = new mongoose.Schema(
  {
    recipientId: {
      type: String,
      required: true,
      index: true,
    },
    hashedOtp: {
      type: String,
      required: true,
    },
    expiration: {
      type: Date,
      default: Date.now(),
    },
    context: {
      type: String,
      enum: Object.values(OTPContext),
      default: OTPContext.LOGIN,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      expires: '10m',
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

otpSchema.pre('save', async function (done) {
  if (this.isModified('hashedOtp')) {
    const hashed = await PasswordManager.toHash(this.get('hashedOtp'));
    this.set('hashedOtp', hashed);
  }

  done();
});

const Otp = mongoose.model<OTPDoc, OTPModel>('Otp', otpSchema);

export { Otp };

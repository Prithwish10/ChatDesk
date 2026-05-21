import mongoose from 'mongoose';
import { IUserAttrs, IUserDoc, IUserModel } from '../interfaces/IUser';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { IEvent } from '../interfaces/IEvent';

const userSchema = new mongoose.Schema<IUserDoc>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
      default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    countryCode: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
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

userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);

userSchema.statics.findByEvent = (event: IEvent) => {
  return User.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

userSchema.statics.build = (attrs: IUserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema);

export { User };

import mongoose from 'mongoose';
import { UserAttrs, UserDoc, UserModel } from '../interfaces/User';
import { PasswordManager } from '../services/PasswordManager.service';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

const userSchema = new mongoose.Schema(
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
    mobileNumber: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
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
        delete ret.password;
        delete ret.__v;
      },
    },
  },
);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);

userSchema.pre('updateOne', function (next) {
  this.updateOne({}, { $set: { updatedAt: new Date() } });
  next();
});

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await PasswordManager.toHash(this.get('password'));
    this.set('password', hashed);
  }

  done();
});

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };

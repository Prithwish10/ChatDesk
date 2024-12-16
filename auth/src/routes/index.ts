import { Router } from 'express';
import signUpRoute from './signup.route';
import signInRoute from './signin.route';
import signOutRoute from './signout.route';
import currentUserRoute from './currentuser.route';
import sendOTPRoute from './send-otp.route';

export default () => {
  const app = Router();
  signUpRoute(app);
  signInRoute(app);
  signOutRoute(app);
  sendOTPRoute(app);
  currentUserRoute(app);

  return app;
};

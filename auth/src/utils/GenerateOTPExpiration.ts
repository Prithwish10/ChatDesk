import config from '../config/config.global';

export function generateOtpExpiration(): Date {
  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + config.otpExpirationMinutes);
  return expirationDate;
}

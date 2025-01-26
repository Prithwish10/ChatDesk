export interface IOtpDeliveryStrategy {
  sendOtp(recipient: string, otp: string, username?: string): Promise<void>;
}

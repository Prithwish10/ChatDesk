import request from 'supertest';
import createApp from '../../loaders/app';
import { OtpGenerator } from '../../utils/OtpGenerator';
jest.mock('../../loaders/NatsWrapper');
const TEST_USER = {
  firstName: 'Alpha',
  lastName: 'Test',
  countryCode: '+91',
  mobileNumber: '9087123451',
  email: 'alpha@test.com',
  password: 'alpha@123',
};
describe('POST /api/v1/users/send-otp', () => {
  let app: ReturnType<typeof createApp>;
  beforeEach(() => {
    app = createApp();
  });
  describe('request validation', () => {
    it('returns 422 when body is empty', async () => {
      await request(app).post('/api/v1/users/send-otp').send({}).expect(422);
    });
    it('returns 422 when types is missing', async () => {
      await request(app)
        .post('/api/v1/users/send-otp')
        .send({ recipientId: TEST_USER.email })
        .expect(422);
    });
    it('returns 422 when types is an empty array', async () => {
      await request(app)
        .post('/api/v1/users/send-otp')
        .send({ types: [], recipientId: TEST_USER.email })
        .expect(422);
    });
    it('returns 422 when recipientId is not a valid email or E.164 phone number', async () => {
      await request(app)
        .post('/api/v1/users/send-otp')
        .send({ types: ['email'], recipientId: 'not-valid' })
        .expect(422);
    });
    it('returns 422 for an unsupported OTP channel', async () => {
      await request(app)
        .post('/api/v1/users/send-otp')
        .send({ types: ['carrier_pigeon'], recipientId: TEST_USER.email })
        .expect(422);
    });
    it('returns 422 when duplicate channels are provided', async () => {
      await request(app)
        .post('/api/v1/users/send-otp')
        .send({ types: ['email', 'email'], recipientId: TEST_USER.email })
        .expect(422);
    });
  });
  describe('user lookup', () => {
    it('returns 400 when the recipient is not a registered user', async () => {
      await request(app)
        .post('/api/v1/users/send-otp')
        .send({ types: ['email'], recipientId: 'ghost@test.com' })
        .expect(400);
    });
  });
  describe('successful OTP dispatch', () => {
    beforeEach(async () => {
      await request(app).post('/api/v1/users/signup').send(TEST_USER).expect(201);
    });
    it('returns 200 when requesting OTP via email only', async () => {
      const response = await request(app)
        .post('/api/v1/users/send-otp')
        .send({ types: ['email'], recipientId: TEST_USER.email })
        .expect(200);
      expect(response.body.success).toBe(true);
    });
    it('returns 200 when requesting OTP via sms only', async () => {
      await request(app)
        .post('/api/v1/users/send-otp')
        .send({
          types: ['sms'],
          recipientId: `${TEST_USER.countryCode}${TEST_USER.mobileNumber}`,
        })
        .expect(200);
    });
    it('returns 200 when requesting OTP via email and sms simultaneously', async () => {
      const response = await request(app)
        .post('/api/v1/users/send-otp')
        .send({ types: ['email', 'sms'], recipientId: TEST_USER.email })
        .expect(200);
      expect(response.body.success).toBe(true);
    });
  });
  describe('rate limiting', () => {
    it('returns 429 once the per-minute request limit is exceeded', async () => {
      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/api/v1/users/send-otp')
          .send({ types: ['email'], recipientId: 'ghost@test.com' });
      }
      await request(app)
        .post('/api/v1/users/send-otp')
        .send({ types: ['email'], recipientId: 'ghost@test.com' })
        .expect(429);
    });
    it('rate limit is scoped per recipient — different recipients do not share a bucket', async () => {
      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/api/v1/users/send-otp')
          .send({ types: ['email'], recipientId: 'user1@test.com' });
      }
      await request(app)
        .post('/api/v1/users/send-otp')
        .send({ types: ['email'], recipientId: 'user2@test.com' })
        .expect(400); // 400 not 429 — user doesn't exist but is within its own rate limit
    });
  });
  describe('OTP generator integration', () => {
    it('generates exactly one OTP regardless of how many channels are requested', async () => {
      await request(app).post('/api/v1/users/signup').send(TEST_USER).expect(201);
      const spy = jest.spyOn(OtpGenerator, 'generateOtp');
      await request(app)
        .post('/api/v1/users/send-otp')
        .send({ types: ['email', 'sms'], recipientId: TEST_USER.email })
        .expect(200); // One OTP is generated and shared across all channels — not one per channel
      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });
  });
});

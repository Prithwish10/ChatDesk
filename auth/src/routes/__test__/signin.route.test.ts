import request from 'supertest';
import createApp from '../../loaders/app';
import { OtpGenerator } from '../../utils/OtpGenerator';
jest.mock('../../loaders/NatsWrapper');
const SIGNUP_PAYLOAD = {
  firstName: 'Alpha',
  lastName: 'Test',
  countryCode: '+91',
  mobileNumber: '1290512892',
  email: 'test@test.com',
  password: 'test@123',
};
// ─── username / password signin ──────────────────────────────────────────────
it('fails when an email that doesnot exist is supplied', async () => {
  const app = createApp();
  await request(app)
    .post('/api/v1/users/signin')
    .send({
      login_type: 'username_password',
      recipientId: 'test@test.com',
      credential: 'test@123',
    })
    .expect(401);
});
it('fails when an incorrect password is supplied', async () => {
  const app = createApp();
  await request(app)
    .post('/api/v1/users/signup')
    .send({
      firstName: 'Alpha',
      lastName: 'test',
      countryCode: '+91',
      mobileNumber: '9087123451',
      email: 'alpha1@test.com',
      password: 'alpha1@123',
    })
    .expect(201);
  await request(app)
    .post('/api/v1/users/signin')
    .send({
      login_type: 'username_password',
      recipientId: '+919087123451',
      credential: 'test@123',
    })
    .expect(400);
});
it('responds with a cookie when given valid credentials', async () => {
  const app = createApp();
  await request(app).post('/api/v1/users/signup').send(SIGNUP_PAYLOAD).expect(201);
  const signinResponse = await request(app)
    .post('/api/v1/users/signin')
    .send({
      login_type: 'username_password',
      recipientId: SIGNUP_PAYLOAD.email,
      credential: SIGNUP_PAYLOAD.password,
    })
    .expect(200);
  expect(signinResponse.get('Set-Cookie')).toBeDefined();
});
// ─── OTP-based signin ─────────────────────────────────────────────────────────
describe('OTP-based signin', () => {
  const KNOWN_OTP = '123456';
  let app: ReturnType<typeof createApp>;
  let generateOtpSpy: jest.SpyInstance;
  beforeEach(async () => {
    app = createApp(); // Pin the generated OTP to a known value so tests can submit the correct credential
    generateOtpSpy = jest.spyOn(OtpGenerator, 'generateOtp').mockReturnValue(KNOWN_OTP); // Ensure the test user exists before each OTP test
    await request(app).post('/api/v1/users/signup').send(SIGNUP_PAYLOAD).expect(201);
  });
  afterEach(() => {
    generateOtpSpy.mockRestore();
  });
  it('returns 401 when no OTP has been requested (key does not exist in Redis)', async () => {
    await request(app)
      .post('/api/v1/users/signin')
      .send({ login_type: 'otp', recipientId: SIGNUP_PAYLOAD.email, credential: KNOWN_OTP })
      .expect(401);
  });
  it('returns 401 when an incorrect OTP credential is submitted', async () => {
    await request(app)
      .post('/api/v1/users/send-otp')
      .send({ types: ['email'], recipientId: SIGNUP_PAYLOAD.email });
    await request(app)
      .post('/api/v1/users/signin')
      .send({ login_type: 'otp', recipientId: SIGNUP_PAYLOAD.email, credential: '000000' })
      .expect(401);
  });
  it('returns 200 and sets a session cookie when the correct OTP is submitted', async () => {
    await request(app)
      .post('/api/v1/users/send-otp')
      .send({ types: ['email'], recipientId: SIGNUP_PAYLOAD.email });
    const response = await request(app)
      .post('/api/v1/users/signin')
      .send({ login_type: 'otp', recipientId: SIGNUP_PAYLOAD.email, credential: KNOWN_OTP })
      .expect(200);
    expect(response.body.success).toBe(true);
    expect(response.get('Set-Cookie')).toBeDefined();
  });
  it('returns 429 and invalidates the OTP after max failed verification attempts', async () => {
    await request(app)
      .post('/api/v1/users/send-otp')
      .send({ types: ['email'], recipientId: SIGNUP_PAYLOAD.email }); // 5 wrong attempts — each returns 401
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/v1/users/signin')
        .send({ login_type: 'otp', recipientId: SIGNUP_PAYLOAD.email, credential: '000000' })
        .expect(401);
    } // 6th attempt triggers lockout (attempts stored = 5 >= maxAttempts 5)
    await request(app)
      .post('/api/v1/users/signin')
      .send({ login_type: 'otp', recipientId: SIGNUP_PAYLOAD.email, credential: '000000' })
      .expect(429);
  });
  it('prevents OTP reuse after a successful login (replay attack protection)', async () => {
    await request(app)
      .post('/api/v1/users/send-otp')
      .send({ types: ['email'], recipientId: SIGNUP_PAYLOAD.email }); // First login succeeds and the OTP is immediately consumed
    await request(app)
      .post('/api/v1/users/signin')
      .send({ login_type: 'otp', recipientId: SIGNUP_PAYLOAD.email, credential: KNOWN_OTP })
      .expect(200); // Replaying the same OTP is rejected because the Redis key was deleted
    await request(app)
      .post('/api/v1/users/signin')
      .send({ login_type: 'otp', recipientId: SIGNUP_PAYLOAD.email, credential: KNOWN_OTP })
      .expect(401);
  });
  it('allows re-login after requesting a new OTP following a successful logout', async () => {
    // First OTP cycle
    await request(app)
      .post('/api/v1/users/send-otp')
      .send({ types: ['email'], recipientId: SIGNUP_PAYLOAD.email });
    await request(app)
      .post('/api/v1/users/signin')
      .send({ login_type: 'otp', recipientId: SIGNUP_PAYLOAD.email, credential: KNOWN_OTP })
      .expect(200); // Second OTP cycle — new OTP is generated (same mock value for simplicity)
    await request(app)
      .post('/api/v1/users/send-otp')
      .send({ types: ['email'], recipientId: SIGNUP_PAYLOAD.email });
    await request(app)
      .post('/api/v1/users/signin')
      .send({ login_type: 'otp', recipientId: SIGNUP_PAYLOAD.email, credential: KNOWN_OTP })
      .expect(200);
  });
});

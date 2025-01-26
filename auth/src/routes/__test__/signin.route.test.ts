import request from 'supertest';
import createApp from '../../loaders/app';

jest.mock('../../loaders/NatsWrapper');

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

  await request(app)
    .post('/api/v1/users/signup')
    .send({
      firstName: 'Alpha',
      lastName: 'test',
      countryCode: '+91',
      mobileNumber: '1290512892',
      email: 'test@test.com',
      password: 'test@123',
    })
    .expect(201);

  const signinResponse = await request(app)
    .post('/api/v1/users/signin')
    .send({
      login_type: 'username_password',
      recipientId: 'test@test.com',
      credential: 'test@123',
    })
    .expect(200);

  expect(signinResponse.get('Set-Cookie')).toBeDefined();
});

import request from 'supertest';
import createApp from '../../loaders/app';

jest.mock('../../loaders/NatsWrapper');

it('fails when an email that doesnot exist is supplied', async () => {
  const app = createApp();

  await request(app)
    .post('/api/v1/users/signin')
    .send({
      email: 'alpha1@test.com',
      password: 'alpha1@123',
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  const app = createApp();

  await request(app)
    .post('/api/v1/users/signup')
    .send({
      firstName: 'Alpha',
      lastName: 'test',
      mobileNumber: '1290512892',
      email: 'alpha1@test.com',
      password: 'alpha1@123',
    })
    .expect(201);

  await request(app)
    .post('/api/v1/users/signin')
    .send({
      email: 'alpha1@test.com',
      password: 'alpha2@123',
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
      mobileNumber: '1290512892',
      email: 'alpha1@test.com',
      password: 'password',
    })
    .expect(201);

  const signinResponse = await request(app)
    .post('/api/v1/users/signin')
    .send({
      email: 'alpha1@test.com',
      password: 'password',
    })
    .expect(200);

  expect(signinResponse.get('Set-Cookie')).toBeDefined();
});

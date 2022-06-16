import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Reports (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Creates a report for authenticated request', async () => {
    const email = 'test@test.com';
    const report = {
      make: 'Honda',
      model: 'Civic',
      year: 2000,
      lng: 38.889722,
      lat: -77.008889,
      mileage: 12000,
      price: 60000,
    };
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'password' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .post('/reports')
      .set('Cookie', cookie)
      .send(report)
      .expect(201);

    expect(body.model).toEqual(report.model);
    expect(body.userId).toEqual(1);
  });

  it('Throws an error for unauthorized requests', async () => {
    const report = {
      make: 'Honda',
      model: 'Civic',
      year: 2000,
      lng: 38.889722,
      lat: -77.008889,
      mileage: 12000,
      price: 60000,
    };

    await request(app.getHttpServer())
      .post('/reports')
      .send(report)
      .expect(403);
  });
});

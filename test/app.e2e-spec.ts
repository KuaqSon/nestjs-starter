/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import {
  createUserDto1,
  createUserDto2,
  createUserDto3,
  createUserDto4,
  userLoginRequestDto1,
  userLoginRequestDto2,
  userLoginRequestDto3,
} from './test-data';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authentication', () => {
    describe('SignIn', () => {
      // assume test data includes user lulien315@gmail.com with password 'StrongbpassWord12@'
      it('authenticates user with valid credentials and provides a jwt token', async () => {
        const response = await request(app.getHttpServer()).post('/user/signin').send(userLoginRequestDto1).expect(201);
      });

      it('fails to authenticate user with an incorrect password', async () => {
        const response = await request(app.getHttpServer()).post('/user/signin').send(userLoginRequestDto2).expect(401);

        expect(response.body.accessToken).not.toBeDefined();
      });

      // assume test data does not include a nobody@example.com user
      it('fails to authenticate user that does not exist', async () => {
        const response = await request(app.getHttpServer()).post('/user/signin').send(userLoginRequestDto3).expect(401);

        expect(response.body.accessToken).not.toBeDefined();
      });
    });

    describe('SignUp', () => {
      it('create user with valid credentials and this account is not existed', async () => {
        const response = await request(app.getHttpServer()).post('/user/signup').send(createUserDto1).expect(201);
      });

      it('create user with invalid role', async () => {
        const response = await request(app.getHttpServer()).post('/user/signup').send(createUserDto2).expect(409);
      });

      it('create user with invalid firstname and lastname', async () => {
        const response = await request(app.getHttpServer()).post('/user/signup').send(createUserDto3).expect(409);
      });

      it('create user with invalid password', async () => {
        const response = await request(app.getHttpServer()).post('/user/signup').send(createUserDto4).expect(409);
      });
    });
  });
});

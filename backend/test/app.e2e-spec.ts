import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
// Supertest publishes a CommonJS `export =` API.
// eslint-disable-next-line @typescript-eslint/no-require-imports
import request = require('supertest');
import { AppModule } from '../src/app.module';

describe('Medicines API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => app.close());

  it('covers create, validation, conflict, update, detail and delete', async () => {
    await request(app.getHttpServer())
      .post('/api/medicines')
      .send({ name: 'X', unknown: true })
      .expect(400);

    const payload = {
      name: 'Paracetamol 500 mg',
      sku: 'par-500',
      price: 3.5,
      stock: 25,
      requiresPrescription: false,
    };
    const created = await request(app.getHttpServer())
      .post('/api/medicines')
      .send(payload)
      .expect(201);
    expect(created.body.sku).toBe('PAR-500');

    await request(app.getHttpServer()).post('/api/medicines').send(payload).expect(409);

    const updated = await request(app.getHttpServer())
      .patch(`/api/medicines/${created.body.id}`)
      .send({ stock: 31 })
      .expect(200);
    expect(updated.body.stock).toBe(31);

    await request(app.getHttpServer())
      .get(`/api/medicines/${created.body.id}`)
      .expect(200);
    await request(app.getHttpServer())
      .delete(`/api/medicines/${created.body.id}`)
      .expect(204);
    await request(app.getHttpServer())
      .get(`/api/medicines/${created.body.id}`)
      .expect(404);
  });
});


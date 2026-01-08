//Author: Laurent Zogaj
const request = require('supertest');
const express = require('express');
const tilgangRouter = require('../ruter/brukerhandtering/tilgangskontroll');
const { getDb } = require('../db');

jest.mock('../db');
jest.mock('../ruter/brukerhandtering/funksjoner', () => ({
  beskyttetRute: (req, res, next) => next(),
  sjekkRolle: () => (req, res, next) => next()
}));

describe('Tilgangskontroll router', () => {
  let app;
  let mockCollection;
  let mockDb;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      req.user = { _id: '507f1f77bcf86cd799439011', rolle: 'hoved-admin' };
      next();
    });
    app.use('/api', tilgangRouter);

    mockCollection = {
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(() => ({ toArray: jest.fn() }))
    };

    mockDb = {
      collection: jest.fn(() => mockCollection)
    };

    getDb.mockReturnValue(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('skal avvise oppdatering med ugyldig bruker-ID', async () => {
    const response = await request(app)
      .patch('/api/brukere/ugyldig-id')
      .send({ rolle: 'admin' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Ugyldig bruker-ID');
  });

  it('skal oppdatere bruker når ID er gyldig', async () => {
    mockCollection.updateOne.mockResolvedValue({ matchedCount: 1 });

    const response = await request(app)
      .patch('/api/brukere/507f1f77bcf86cd799439012')
      .send({ rolle: 'admin' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Bruker oppdatert');
  });

  it('skal avvise sletting med ugyldig bruker-ID', async () => {
    const response = await request(app).delete('/api/brukere/ugyldig-id');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Ugyldig bruker-ID');
  });

  it('skal returnere 404 når bruker ikke finnes', async () => {
    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 0 });

    const response = await request(app).delete('/api/brukere/507f1f77bcf86cd799439013');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Bruker ikke funnet');
  });

  it('skal hente rolle for bruker', async () => {
    mockCollection.findOne.mockResolvedValue({ rolle: 'hoved-admin', hovedAdmin: true });

    const response = await request(app).get('/api/bruker/rolle');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ rolle: 'hoved-admin', hovedAdmin: true });
  });
});

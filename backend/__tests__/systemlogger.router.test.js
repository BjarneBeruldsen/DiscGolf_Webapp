//Author: Laurent Zogaj
const request = require('supertest');
const express = require('express');
const systemloggRouter = require('../ruter/systemlogger');
const { getDb } = require('../db');

jest.mock('../db');

describe('Systemlogg router', () => {
  let app;
  let mockCollection;
  let mockDb;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/systemlogg', systemloggRouter);

    mockCollection = {
      insertOne: jest.fn(),
      find: jest.fn()
    };

    mockDb = {
      collection: jest.fn(() => mockCollection)
    };

    getDb.mockReturnValue(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('skal avvise logging uten bruker og handling', async () => {
    const response = await request(app)
      .post('/api/systemlogg')
      .send({ bruker: 'testuser' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Bruker og handling er påkrevd');
  });

  it('skal opprette ny loggoppføring', async () => {
    mockCollection.insertOne.mockResolvedValue({ insertedId: 'logg-1' });

    const response = await request(app)
      .post('/api/systemlogg')
      .send({ bruker: 'testuser', handling: 'Opprettet', detaljer: 'Test' });

    expect(response.status).toBe(201);
    expect(response.body._id).toBe('logg-1');
    expect(mockCollection.insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        bruker: 'testuser',
        handling: 'Opprettet',
        detaljer: 'Test'
      })
    );
  });

  it('skal hente alle systemlogger', async () => {
    const logger = [{ bruker: 'testuser', handling: 'Test' }];
    mockCollection.find.mockReturnValue({
      toArray: jest.fn().mockResolvedValue(logger)
    });

    const response = await request(app).get('/api/systemlogg');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(logger);
  });

  it('skal returnere 500 ved feil under henting', async () => {
    mockCollection.find.mockReturnValue({
      toArray: jest.fn().mockRejectedValue(new Error('DB-feil'))
    });

    const response = await request(app).get('/api/systemlogg');

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Kunne ikke hente systemlogg');
  });
});

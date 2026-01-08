//Author: Laurent Zogaj
const request = require('supertest');
const express = require('express');
const tilgangRouter = require('../ruter/brukerhandtering/tilgangskontroll');
const { getDb } = require('../db');

jest.mock('../db');
jest.mock('../models/Systemlogg', () => ({
  leggTilSystemlogg: jest.fn().mockResolvedValue('mock-log-id')
}));
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
      // Bruker ObjectId for å matche hvordan MongoDB forventer det
      const { ObjectId } = require('mongodb');
      req.user = { 
        _id: new ObjectId('507f1f77bcf86cd799439011'), 
        rolle: 'hoved-admin',
        brukernavn: 'test-admin'
      };
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
    // Verifiserer at databasen ikke ble aksessert
    expect(mockCollection.findOne).not.toHaveBeenCalled();
    expect(mockCollection.updateOne).not.toHaveBeenCalled();
  });

  it('skal oppdatere bruker når ID er gyldig', async () => {
    const { ObjectId } = require('mongodb');
    const brukerId = new ObjectId('507f1f77bcf86cd799439012');
    
    // Mock findOne for å returnere en bruker (sjekkes før oppdatering)
    mockCollection.findOne.mockResolvedValue({
      _id: brukerId,
      brukernavn: 'testuser',
      rolle: 'user'
    });
    
    // Mock updateOne for å returnere suksess
    mockCollection.updateOne.mockResolvedValue({ matchedCount: 1 });

    const response = await request(app)
      .patch('/api/brukere/507f1f77bcf86cd799439012')
      .send({ rolle: 'admin' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Bruker oppdatert');
    expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: brukerId });
    expect(mockCollection.updateOne).toHaveBeenCalled();
  });

  it('skal avvise sletting med ugyldig bruker-ID', async () => {
    const response = await request(app).delete('/api/brukere/ugyldig-id');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Ugyldig bruker-ID');
    // Verifiserer at databasen ikke ble aksessert
    expect(mockCollection.findOne).not.toHaveBeenCalled();
    expect(mockCollection.deleteOne).not.toHaveBeenCalled();
  });

  it('skal returnere 404 når bruker ikke finnes', async () => {
    const { ObjectId } = require('mongodb');
    const brukerId = new ObjectId('507f1f77bcf86cd799439013');
    
    // Mock findOne for å returnere null (bruker finnes ikke)
    mockCollection.findOne.mockResolvedValue(null);
    
    // Mock deleteOne (selv om den ikke vil bli nådd hvis findOne returnerer null)
    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 0 });

    const response = await request(app).delete('/api/brukere/507f1f77bcf86cd799439013');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Bruker ikke funnet');
    expect(mockCollection.findOne).toHaveBeenCalledWith({ _id: brukerId });
  });

  it('skal hente rolle for bruker', async () => {
    mockCollection.findOne.mockResolvedValue({ rolle: 'hoved-admin', hovedAdmin: true });

    const response = await request(app).get('/api/bruker/rolle');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ rolle: 'hoved-admin', hovedAdmin: true });
  });
});

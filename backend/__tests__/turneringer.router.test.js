//Author: Laurent Zogaj
const request = require('supertest');
const express = require('express');
const { ObjectId } = require('mongodb');
const turneringRouter = require('../ruter/Turneringer');
const { getDb } = require('../db');

jest.mock('../db');

describe('Turneringer router (mobil)', () => {
  let app;
  let mockCollection;
  let mockDb;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(turneringRouter);

    mockCollection = {
      insertOne: jest.fn(),
      findOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
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

  it('skal avvise opprettelse uten bruker-ID', async () => {
    const response = await request(app)
      .post('/api/mobile/turneringer')
      .send({
        navn: 'Mobil Cup',
        beskrivelse: 'Kort beskrivelse',
        dato: '2025-01-20',
        sted: 'Oslo',
        adresse: 'Gate 1',
        deltakere: 10,
        premiepott: '5000',
        kontakt: 'Testperson'
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Mangler bruker-ID. Du må være logget inn.');
  });

  it('skal avvise opprettelse med ugyldige felter', async () => {
    const response = await request(app)
      .post('/api/mobile/turneringer')
      .send({
        userId: 'user-1',
        navn: 'Mobil Cup',
        beskrivelse: 'Kort beskrivelse',
        dato: '2025-01-20',
        sted: 'Oslo',
        adresse: 'Gate 1',
        deltakere: 0,
        premiepott: '5000',
        kontakt: 'Testperson'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it('skal opprette mobil turnering når input er gyldig', async () => {
    const insertedId = new ObjectId();
    mockCollection.insertOne.mockResolvedValue({ insertedId });

    const response = await request(app)
      .post('/api/mobile/turneringer')
      .send({
        userId: 'user-1',
        navn: 'Mobil Cup',
        beskrivelse: 'Kort beskrivelse',
        dato: '2025-01-20',
        sted: 'Oslo',
        adresse: 'Gate 1',
        deltakere: 10,
        premiepott: '5000',
        kontakt: 'Testperson'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.turneringId).toBe(insertedId.toString());
  });

  it('skal avvise oppdatering når bruker ikke er eier', async () => {
    const turneringId = new ObjectId();
    mockCollection.findOne.mockResolvedValue({
      _id: turneringId,
      opprettetAv: new ObjectId()
    });

    const response = await request(app)
      .patch(`/api/mobile/turneringer/${turneringId}`)
      .send({ userId: 'user-1', navn: 'Oppdatert' });

    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Du har ikke tilgang til å oppdatere denne turneringen');
  });

  it('skal avvise sletting med ugyldig ID-format', async () => {
    const response = await request(app).delete('/api/mobile/turneringer/ugyldig-id');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Ugyldig turnering-ID format');
  });

  it('skal avvise sletting uten bruker-ID', async () => {
    const turneringId = new ObjectId();
    const response = await request(app).delete(`/api/mobile/turneringer/${turneringId}`);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Mangler bruker-ID for verifisering.');
  });

  it('skal avvise påmelding dersom bruker allerede er påmeldt', async () => {
    const turneringId = new ObjectId();
    mockCollection.findOne.mockResolvedValue({
      _id: turneringId,
      registreringer: [{ userId: 'user-1' }]
    });

    const response = await request(app)
      .post(`/api/mobile/turneringer/${turneringId}/pamelding`)
      .send({ userId: 'user-1' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Du er allerede påmeldt denne turneringen');
  });
});

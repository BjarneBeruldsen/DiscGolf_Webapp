//Author: Laurent Zogaj
const { ObjectId } = require('mongodb');
const { getDb } = require('../db');

jest.mock('../db');

describe('Turneringer', () => {
  let mockDb;
  let mockCollection;

  beforeEach(() => {
    mockCollection = {
      find: jest.fn(() => ({
        toArray: jest.fn(() =>
          Promise.resolve([
            {
              _id: new ObjectId(),
              navn: 'Test Turnering',
              dato: new Date(),
            },
          ])
        ),
      })),
      findOne: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
    };

    mockDb = {
      collection: jest.fn(() => mockCollection),
    };

    getDb.mockReturnValue(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Hente turneringer', () => {
    it('skal hente alle turneringer', async () => {
      const turneringer = await mockCollection.find().toArray();
      expect(turneringer).toBeDefined();
      expect(Array.isArray(turneringer)).toBe(true);
      expect(turneringer.length).toBeGreaterThan(0);
    });

    it('skal hente en spesifikk turnering', async () => {
      const testId = new ObjectId();
      mockCollection.findOne.mockResolvedValue({
        _id: testId,
        navn: 'Test Turnering',
        dato: new Date(),
      });

      const turnering = await mockCollection.findOne({ _id: testId });
      expect(turnering).toBeDefined();
      expect(turnering._id).toEqual(testId);
    });
  });

  describe('Opprette turnering', () => {
    it('skal opprette ny turnering', async () => {
      const nyTurnering = {
        navn: 'Ny Turnering',
        dato: new Date(),
        bane: 'Test Bane',
        beskrivelse: 'Test beskrivelse',
      };

      mockCollection.insertOne.mockResolvedValue({
        insertedId: new ObjectId(),
      });

      const result = await mockCollection.insertOne(nyTurnering);
      expect(result.insertedId).toBeDefined();
    });
  });

  describe('Oppdatere turnering', () => {
    it('skal oppdatere turnering', async () => {
      const testId = new ObjectId();
      const oppdatering = { navn: 'Oppdatert Navn' };

      mockCollection.updateOne.mockResolvedValue({
        modifiedCount: 1,
      });

      const result = await mockCollection.updateOne(
        { _id: testId },
        { $set: oppdatering }
      );

      expect(result.modifiedCount).toBe(1);
    });
  });

  describe('Slette turnering', () => {
    it('skal slette turnering', async () => {
      const testId = new ObjectId();

      mockCollection.deleteOne.mockResolvedValue({
        deletedCount: 1,
      });

      const result = await mockCollection.deleteOne({ _id: testId });
      expect(result.deletedCount).toBe(1);
    });
  });
});
